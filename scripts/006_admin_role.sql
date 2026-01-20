-- ============================================================
-- ADMIN ROLE SETUP
-- ============================================================

-- Add role column to profiles if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'instructor'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Admin policy for profiles - admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Admin policies for content tables
CREATE POLICY "Admins can manage instructors" ON instructors
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can manage programs" ON programs
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Admins can manage classes" ON classes
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
