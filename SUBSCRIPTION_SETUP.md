# Subscription Model Setup

## Overview

This subscription model implements a tier-based system using the existing `entitlements` table:
- **tier:free** → Baseline, always present for every profile
- **tier:pro** → Valid for 1 month or 1 year
- **tier:lifetime** → Valid for 99 years

The system determines a user's current tier as the highest active + unexpired tier: `lifetime > pro > free`.

## Files Created

1. **Migration**: `supabase-migrations/20260107_subscriptions_entitlements.sql`
2. **UI Page**: `app/myprofile/subscriptions/page.tsx`
3. **Helper Utility**: `lib/subscriptions/tier.ts`

## Applying the Migration

### Option 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `supabase-migrations/20260107_subscriptions_entitlements.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

### Option 2: Supabase CLI (if installed)

```bash
supabase db push
```

Or if you have migrations configured:

```bash
supabase migration up
```

## What the Migration Does

1. **Creates indexes** on `entitlements` table for performance:
   - Unique index on `(user_id, key)` to prevent duplicates
   - Indexes on `key` and `user_id` for faster queries

2. **Sets up RLS (Row Level Security)**:
   - Users can read their own entitlements
   - Users cannot insert/update/delete entitlements directly (must use RPC functions)

3. **Creates `set_updated_at()` function**:
   - Automatically updates `updated_at` timestamp on row updates

4. **Creates `bootstrap_free_tier()` function and trigger**:
   - Automatically creates a `tier:free` entitlement when a profile is created

5. **Creates `purchase_subscription()` RPC function**:
   - Allows authenticated users to purchase/activate tiers
   - Parameters: `p_tier` (free|pro|lifetime), `p_cycle` (month|year, for pro only)

6. **Creates `current_user_tier()` RPC function**:
   - Returns the user's current tier and valid_until date
   - Uses tier priority: lifetime > pro > free

## Verification Checklist

### In Supabase Dashboard:

1. **Check RLS is enabled**:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' AND tablename = 'entitlements';
   ```
   Should show `rowsecurity = true`

2. **Check policies exist**:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'entitlements';
   ```
   Should show "read own entitlements" policy

3. **Check functions exist**:
   ```sql
   SELECT routine_name 
   FROM information_schema.routines 
   WHERE routine_schema = 'public' 
   AND routine_name IN ('bootstrap_free_tier', 'purchase_subscription', 'current_user_tier', 'set_updated_at');
   ```
   Should return all 4 functions

4. **Test RPC functions** (as authenticated user):
   ```sql
   -- Get current tier
   SELECT * FROM current_user_tier();
   
   -- Purchase pro (monthly)
   SELECT * FROM purchase_subscription('pro', 'month');
   
   -- Check tier again
   SELECT * FROM current_user_tier();
   ```

### In the App:

1. **Navigate to `/myprofile/subscriptions`**
   - Should load without errors
   - Should display current tier (should be "free" for new users)

2. **Test tier activation**:
   - Click "Monthly" or "Yearly" under Pro tier
   - Should update tier to "pro" and show valid_until date
   - Click "Get Lifetime" under Lifetime tier
   - Should update tier to "lifetime"

3. **Verify free tier bootstrap**:
   - Create a new user profile
   - Check `entitlements` table - should have `tier:free` entry

## UI Features

The subscriptions page (`/myprofile/subscriptions`) includes:

- **Current Subscription Card**: Shows current tier and valid_until date
- **Three Tier Cards**:
  - **Free**: Default tier, always available
  - **Pro**: Monthly or Yearly options
  - **Lifetime**: One-time purchase, 99 years validity
- **Real-time updates**: Tier changes reflect immediately after purchase
- **Error handling**: Displays errors if RPC calls fail

## Helper Utility

The `lib/subscriptions/tier.ts` file provides:

- `Tier` type: `"free" | "pro" | "lifetime"`
- `tierPriority`: Priority mapping for tier comparison
- `hasAtLeastTier()`: Helper function to check if user has required tier

## Next Steps (Stripe Integration)

When ready to integrate Stripe:

1. Create Stripe webhook endpoint
2. On successful payment, call `purchase_subscription()` RPC with appropriate tier
3. Or update `entitlements` table directly via service_role
4. The UI will automatically reflect the new tier

## Troubleshooting

**Issue**: RPC functions return "permission denied"
- **Solution**: Ensure functions have `GRANT EXECUTE` to `authenticated` role

**Issue**: Free tier not created on profile creation
- **Solution**: Check that `bootstrap_free_tier()` trigger is attached to `profiles` table

**Issue**: UI shows "Failed to load subscription"
- **Solution**: 
  - Check browser console for errors
  - Verify RPC functions exist in Supabase
  - Check RLS policies allow SELECT on entitlements




