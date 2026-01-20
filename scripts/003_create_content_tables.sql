-- ============================================================
-- CONTENT TABLES FOR YOGA PLATFORM
-- Run this script to create all content-related tables
-- ============================================================

-- INSTRUCTORS TABLE
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  bio TEXT,
  specialty VARCHAR(255),
  avatar_url TEXT,
  credentials TEXT[],
  social_instagram VARCHAR(255),
  social_website VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROGRAMS TABLE (Series/Collections)
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  thumbnail_url TEXT,
  cover_url TEXT,
  duration_days INT,
  total_classes INT DEFAULT 0,
  level VARCHAR(50) CHECK (level IN ('principiante', 'intermedio', 'avanzado', 'todos')),
  pillar VARCHAR(100) CHECK (pillar IN ('yoga', 'meditacion', 'respiracion', 'movimiento', 'nutricion', 'descanso')),
  instructor_id UUID REFERENCES instructors(id),
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  instructor_id UUID REFERENCES instructors(id),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  vimeo_video_id VARCHAR(100),
  duration_minutes INT NOT NULL,
  level VARCHAR(50) CHECK (level IN ('principiante', 'intermedio', 'avanzado', 'todos')),
  intensity VARCHAR(50) CHECK (intensity IN ('suave', 'moderado', 'intenso')),
  pillar VARCHAR(100) CHECK (pillar IN ('yoga', 'meditacion', 'respiracion', 'movimiento', 'nutricion', 'descanso')),
  day_number INT, -- For sequential programs
  sequence INT, -- Order within program
  equipment TEXT[], -- e.g., ['mat', 'blocks', 'strap']
  focus_areas TEXT[], -- e.g., ['espalda', 'hombros', 'caderas']
  is_free BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- USER PROGRESS TABLE
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
  watch_position_seconds INT DEFAULT 0,
  watch_percentage DECIMAL(5,2) DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  last_watched_at TIMESTAMPTZ DEFAULT NOW(),
  total_watch_time_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, class_id)
);

-- USER FAVORITES TABLE
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, class_id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_classes_program ON classes(program_id);
CREATE INDEX IF NOT EXISTS idx_classes_instructor ON classes(instructor_id);
CREATE INDEX IF NOT EXISTS idx_classes_pillar ON classes(pillar);
CREATE INDEX IF NOT EXISTS idx_classes_level ON classes(level);
CREATE INDEX IF NOT EXISTS idx_classes_published ON classes(is_published);
CREATE INDEX IF NOT EXISTS idx_programs_pillar ON programs(pillar);
CREATE INDEX IF NOT EXISTS idx_programs_instructor ON programs(instructor_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_class ON user_progress(class_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user ON user_favorites(user_id);

-- ROW LEVEL SECURITY
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ for published content
CREATE POLICY "Public can view active instructors" ON instructors
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view published programs" ON programs
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public can view published classes" ON classes
  FOR SELECT USING (is_published = true);

-- USER PROGRESS policies
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- USER FAVORITES policies
CREATE POLICY "Users can view own favorites" ON user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON user_favorites
  FOR DELETE USING (auth.uid() = user_id);
