-- Harden ensure_subscription_row() permissions in Supabase environments
-- where default function grants may include anon.

REVOKE ALL ON FUNCTION public.ensure_subscription_row() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.ensure_subscription_row() FROM anon;
REVOKE ALL ON FUNCTION public.ensure_subscription_row() FROM service_role;
GRANT EXECUTE ON FUNCTION public.ensure_subscription_row() TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_subscription_row() TO service_role;
