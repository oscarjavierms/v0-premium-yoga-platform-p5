-- ============================================================
-- FIX: Infinite recursion in profiles RLS policies
-- Error 42P17 was caused by admin policy querying profiles table
-- ============================================================

-- First, drop ALL existing policies on profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- ============================================================
-- NEW POLICIES - Using (select auth.uid()) for optimization
-- and avoiding self-referencing queries
-- ============================================================

-- 1. SELECT: Users can read their own profile
-- Using (select auth.uid()) wraps the function for better performance
CREATE POLICY "profiles_select_own"
  ON public.profiles 
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

-- 2. INSERT: Users can create their own profile
CREATE POLICY "profiles_insert_own"
  ON public.profiles 
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

-- 3. UPDATE: Users can update their own profile
CREATE POLICY "profiles_update_own"
  ON public.profiles 
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- 4. DELETE: Users can delete their own profile
CREATE POLICY "profiles_delete_own"
  ON public.profiles 
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = id);

-- ============================================================
-- ADMIN ACCESS: Use security definer function instead of
-- querying profiles table (which causes infinite recursion)
-- ============================================================

-- Create a security definer function to check admin status
-- This function bypasses RLS and won't cause recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 5. ADMIN SELECT: Admins can view all profiles using the function
CREATE POLICY "profiles_admin_select_all"
  ON public.profiles 
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = id 
    OR 
    (select public.is_admin())
  );

-- Note: We need to drop the previous select policy and recreate combined one
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;

-- Combined SELECT policy (own profile OR admin)
CREATE POLICY "profiles_select"
  ON public.profiles 
  FOR SELECT
  TO authenticated
  USING (
    (select auth.uid()) = id 
    OR 
    (select public.is_admin())
  );

-- ============================================================
-- Also fix user_preferences if it has similar issues
-- ============================================================

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;

CREATE POLICY "user_preferences_select"
  ON public.user_preferences 
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "user_preferences_insert"
  ON public.user_preferences 
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "user_preferences_update"
  ON public.user_preferences 
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- ============================================================
-- Verify the changes
-- ============================================================
-- To check policies: SELECT * FROM pg_policies WHERE tablename = 'profiles';
