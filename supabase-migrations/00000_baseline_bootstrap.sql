-- Baseline bootstrap migration for a fresh Supabase project.
-- This migration is designed to be reasonably safe to run repeatedly.

-- ---------------------------------------------------------------------------
-- Core tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  first_name text,
  last_name text,
  email text,
  avatar_url text,
  date_of_birth date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  article_id text NOT NULL,
  article_slug text,
  article_title text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.entitlements (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  key text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  valid_until timestamptz,
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.newsletter_preferences (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  newsletter_key text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Subscription + Stripe integration tables inferred from app usage
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  tier text NOT NULL DEFAULT 'free',
  valid_until timestamptz,
  billing_cycle text,
  status text NOT NULL DEFAULT 'active',
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_tier_check CHECK (tier IN ('free', 'pro', 'lifetime')),
  CONSTRAINT subscriptions_billing_cycle_check CHECK (billing_cycle IN ('month', 'year') OR billing_cycle IS NULL)
);

CREATE TABLE IF NOT EXISTS public.stripe_subscriptions (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  stripe_subscription_id text NOT NULL UNIQUE,
  status text,
  price_id text,
  current_period_end timestamptz,
  cancel_at_period_end boolean,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stripe_customers (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  stripe_customer_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.stripe_webhook_events (
  event_id text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Additive safety for existing projects
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.bookmarks
  ADD COLUMN IF NOT EXISTS article_title text;

-- ---------------------------------------------------------------------------
-- Indexes and uniqueness
-- ---------------------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS bookmarks_user_id_article_id_key
  ON public.bookmarks (user_id, article_id);

CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx
  ON public.bookmarks (user_id);

CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx
  ON public.bookmarks (created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS entitlements_user_id_key_key
  ON public.entitlements (user_id, key);

CREATE INDEX IF NOT EXISTS entitlements_user_id_idx
  ON public.entitlements (user_id);

CREATE INDEX IF NOT EXISTS entitlements_key_idx
  ON public.entitlements (key);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_preferences_user_id_newsletter_key_key
  ON public.newsletter_preferences (user_id, newsletter_key);

CREATE INDEX IF NOT EXISTS newsletter_preferences_user_id_idx
  ON public.newsletter_preferences (user_id);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx
  ON public.subscriptions (user_id);

CREATE INDEX IF NOT EXISTS subscriptions_tier_idx
  ON public.subscriptions (tier);

CREATE INDEX IF NOT EXISTS stripe_subscriptions_user_id_idx
  ON public.stripe_subscriptions (user_id);

CREATE INDEX IF NOT EXISTS stripe_subscriptions_created_at_idx
  ON public.stripe_subscriptions (created_at DESC);

-- ---------------------------------------------------------------------------
-- Functions and triggers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS trg_profiles_set_updated_at ON public.profiles;
    CREATE TRIGGER trg_profiles_set_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF to_regclass('public.entitlements') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS trg_entitlements_set_updated_at ON public.entitlements;
    CREATE TRIGGER trg_entitlements_set_updated_at
      BEFORE UPDATE ON public.entitlements
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF to_regclass('public.newsletter_preferences') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS trg_newsletter_preferences_set_updated_at ON public.newsletter_preferences;
    CREATE TRIGGER trg_newsletter_preferences_set_updated_at
      BEFORE UPDATE ON public.newsletter_preferences
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF to_regclass('public.subscriptions') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS trg_subscriptions_set_updated_at ON public.subscriptions;
    CREATE TRIGGER trg_subscriptions_set_updated_at
      BEFORE UPDATE ON public.subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF to_regclass('public.stripe_subscriptions') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS trg_stripe_subscriptions_set_updated_at ON public.stripe_subscriptions;
    CREATE TRIGGER trg_stripe_subscriptions_set_updated_at
      BEFORE UPDATE ON public.stripe_subscriptions
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.ensure_subscription_row()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.subscriptions (user_id, tier, status, source)
  VALUES (v_user_id, 'free', 'active', 'bootstrap')
  ON CONFLICT (user_id) DO NOTHING;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_subscription_row() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ensure_subscription_row() FROM anon;
REVOKE ALL ON FUNCTION public.ensure_subscription_row() FROM service_role;
GRANT EXECUTE ON FUNCTION public.ensure_subscription_row() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_subscription_row() TO service_role;

CREATE OR REPLACE FUNCTION public.bootstrap_free_tier()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id, tier, status, source)
  VALUES (NEW.id, 'free', 'active', 'bootstrap')
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS trg_profiles_bootstrap_free_tier ON public.profiles;
    CREATE TRIGGER trg_profiles_bootstrap_free_tier
      AFTER INSERT ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.bootstrap_free_tier();
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_webhook_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  -- profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_select_own'
  ) THEN
    CREATE POLICY profiles_select_own ON public.profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_insert_own'
  ) THEN
    CREATE POLICY profiles_insert_own ON public.profiles
      FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'profiles_update_own'
  ) THEN
    CREATE POLICY profiles_update_own ON public.profiles
      FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;

  -- bookmarks
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'bookmarks' AND policyname = 'bookmarks_select_own'
  ) THEN
    CREATE POLICY bookmarks_select_own ON public.bookmarks
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'bookmarks' AND policyname = 'bookmarks_insert_own'
  ) THEN
    CREATE POLICY bookmarks_insert_own ON public.bookmarks
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'bookmarks' AND policyname = 'bookmarks_delete_own'
  ) THEN
    CREATE POLICY bookmarks_delete_own ON public.bookmarks
      FOR DELETE USING (auth.uid() = user_id);
  END IF;

  -- entitlements
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'entitlements' AND policyname = 'entitlements_select_own'
  ) THEN
    CREATE POLICY entitlements_select_own ON public.entitlements
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- newsletter_preferences
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'newsletter_preferences' AND policyname = 'newsletter_preferences_select_own'
  ) THEN
    CREATE POLICY newsletter_preferences_select_own ON public.newsletter_preferences
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'newsletter_preferences' AND policyname = 'newsletter_preferences_insert_own'
  ) THEN
    CREATE POLICY newsletter_preferences_insert_own ON public.newsletter_preferences
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'newsletter_preferences' AND policyname = 'newsletter_preferences_update_own'
  ) THEN
    CREATE POLICY newsletter_preferences_update_own ON public.newsletter_preferences
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  -- subscriptions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'subscriptions' AND policyname = 'subscriptions_select_own'
  ) THEN
    CREATE POLICY subscriptions_select_own ON public.subscriptions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- stripe_subscriptions
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'stripe_subscriptions' AND policyname = 'stripe_subscriptions_select_own'
  ) THEN
    CREATE POLICY stripe_subscriptions_select_own ON public.stripe_subscriptions
      FOR SELECT USING (auth.uid() = user_id);
  END IF;

  -- stripe_customers
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'stripe_customers' AND policyname = 'stripe_customers_select_own'
  ) THEN
    CREATE POLICY stripe_customers_select_own ON public.stripe_customers
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END;
$$;

-- ---------------------------------------------------------------------------
-- Comments
-- ---------------------------------------------------------------------------

COMMENT ON COLUMN public.profiles.email IS 'User email from auth provider';
COMMENT ON COLUMN public.profiles.avatar_url IS 'User avatar URL from OAuth provider';
COMMENT ON COLUMN public.profiles.first_name IS 'User first name';
COMMENT ON COLUMN public.profiles.last_name IS 'User last name';
COMMENT ON COLUMN public.profiles.date_of_birth IS 'User date of birth (YYYY-MM-DD format)';
COMMENT ON COLUMN public.bookmarks.article_title IS 'Stores the article title from Sanity for display purposes';
