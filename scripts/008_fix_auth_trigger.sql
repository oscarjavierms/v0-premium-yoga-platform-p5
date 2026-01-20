-- Fix the handle_new_user trigger to properly save user data from registration
-- The issue is the registration sends first_name and last_name but trigger expects full_name

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the corrected function following Supabase official documentation
-- Using set search_path = '' for security as recommended by Supabase
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    -- Combine first_name and last_name, or use full_name if provided
    COALESCE(
      NULLIF(CONCAT_WS(' ', 
        NEW.raw_user_meta_data->>'first_name', 
        NEW.raw_user_meta_data->>'last_name'
      ), ''),
      NEW.raw_user_meta_data->>'full_name',
      ''
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'user',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
