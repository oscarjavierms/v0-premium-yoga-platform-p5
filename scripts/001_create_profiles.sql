-- Create profiles table that references auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  country TEXT,
  timezone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'instructor')),
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_completed_at TIMESTAMPTZ,
  wellness_goals TEXT[],
  experience_level TEXT CHECK (experience_level IN ('beginner', 'some_experience', 'intermediate', 'advanced')),
  preferred_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for re-running the script)
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;

-- RLS Policies
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "profiles_delete_own"
  ON public.profiles FOR DELETE
  USING (auth.uid() = id);

-- Admin policy for viewing all profiles
CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_id_idx ON public.profiles(id);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
