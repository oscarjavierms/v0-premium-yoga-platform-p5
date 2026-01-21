-- ============================================================
-- SEED DATA FOR DEMO PURPOSES
-- ============================================================

-- Insert sample instructors
INSERT INTO instructors (name, slug, bio, specialty, avatar_url, credentials, is_active) VALUES
(
  'María del Sol',
  'maria-del-sol',
  'Instructora certificada con más de 15 años de experiencia en Vinyasa y Hatha Yoga. Especializada en yoga para ejecutivos y manejo del estrés.',
  'Vinyasa Flow',
  '/placeholder.svg?height=400&width=400',
  ARRAY['RYT-500', 'E-RYT 200', 'YACEP'],
  true
),
(
  'Carlos Mendoza',
  'carlos-mendoza',
  'Experto en meditación y mindfulness. Ha guiado a miles de profesionales hacia una práctica sostenible de autocuidado.',
  'Meditación & Breathwork',
  '/placeholder.svg?height=400&width=400',
  ARRAY['CMT', 'Vipassana Teacher'],
  true
),
(
  'Ana Lucía Vega',
  'ana-lucia-vega',
  'Especialista en movilidad y movimiento funcional. Combina yoga con técnicas modernas de recuperación.',
  'Movilidad & Restaurativo',
  '/placeholder.svg?height=400&width=400',
  ARRAY['RYT-200', 'FRC Mobility Specialist'],
  true
);

-- Insert sample programs
INSERT INTO programs (title, slug, description, short_description, thumbnail_url, duration_days, level, pillar, instructor_id, is_featured, is_published) VALUES
(
  'Flujo Matutino',
  'flujo-matutino',
  'Un programa de 7 días diseñado para establecer una rutina matutina energizante. Cada sesión de 20-30 minutos te preparará para enfrentar el día con claridad y vitalidad.',
  'Despierta tu cuerpo y mente en 7 días',
  '/placeholder.svg?height=600&width=800',
  7,
  'todos',
  'yoga',
  (SELECT id FROM instructors WHERE slug = 'maria-del-sol'),
  true,
  true
),
(
  'Descomprime: Yoga para Oficina',
  'yoga-oficina',
  'Secuencias cortas de 10-15 minutos diseñadas específicamente para hacer en pausas de trabajo. Alivia tensión en cuello, hombros y espalda baja.',
  'Alivia la tensión del trabajo diario',
  '/placeholder.svg?height=600&width=800',
  14,
  'principiante',
  'yoga',
  (SELECT id FROM instructors WHERE slug = 'ana-lucia-vega'),
  true,
  true
),
(
  'Meditación para Ejecutivos',
  'meditacion-ejecutivos',
  'Técnicas de meditación probadas para mejorar el enfoque, reducir el estrés y tomar mejores decisiones. Sesiones de 5-15 minutos.',
  'Claridad mental para líderes',
  '/placeholder.svg?height=600&width=800',
  21,
  'todos',
  'meditacion',
  (SELECT id FROM instructors WHERE slug = 'carlos-mendoza'),
  true,
  true
),
(
  'Respiración Consciente',
  'respiracion-consciente',
  'Domina técnicas de respiración que regulan tu sistema nervioso. Ideal para momentos de alta presión.',
  'Controla tu respuesta al estrés',
  '/placeholder.svg?height=600&width=800',
  10,
  'todos',
  'respiracion',
  (SELECT id FROM instructors WHERE slug = 'carlos-mendoza'),
  false,
  true
);

-- Insert sample classes for "Flujo Matutino" program
INSERT INTO classes (program_id, instructor_id, title, slug, description, thumbnail_url, vimeo_video_id, duration_minutes, level, intensity, pillar, day_number, sequence, equipment, focus_areas, is_free, is_published) VALUES
(
  (SELECT id FROM programs WHERE slug = 'flujo-matutino'),
  (SELECT id FROM instructors WHERE slug = 'maria-del-sol'),
  'Despertar Suave',
  'despertar-suave',
  'Comienza tu semana con movimientos suaves que despiertan el cuerpo sin sobrecargarlo. Perfecto para principiantes.',
  '/placeholder.svg?height=400&width=600',
  '76979871', -- Sample Vimeo ID
  25,
  'principiante',
  'suave',
  'yoga',
  1,
  1,
  ARRAY['mat'],
  ARRAY['espalda', 'cuello'],
  true, -- Free class
  true
),
(
  (SELECT id FROM programs WHERE slug = 'flujo-matutino'),
  (SELECT id FROM instructors WHERE slug = 'maria-del-sol'),
  'Energía y Fluidez',
  'energia-fluidez',
  'Aumentamos el ritmo con un vinyasa moderado que activa la circulación y despierta la mente.',
  '/placeholder.svg?height=400&width=600',
  '76979871',
  30,
  'intermedio',
  'moderado',
  'yoga',
  2,
  2,
  ARRAY['mat'],
  ARRAY['core', 'piernas'],
  false,
  true
),
(
  (SELECT id FROM programs WHERE slug = 'flujo-matutino'),
  (SELECT id FROM instructors WHERE slug = 'maria-del-sol'),
  'Core y Equilibrio',
  'core-equilibrio',
  'Fortalece tu centro y mejora tu equilibrio con posturas que construyen estabilidad desde adentro.',
  '/placeholder.svg?height=400&width=600',
  '76979871',
  28,
  'intermedio',
  'moderado',
  'yoga',
  3,
  3,
  ARRAY['mat', 'blocks'],
  ARRAY['core', 'equilibrio'],
  false,
  true
);

-- Insert standalone classes
INSERT INTO classes (instructor_id, title, slug, description, thumbnail_url, vimeo_video_id, duration_minutes, level, intensity, pillar, equipment, focus_areas, is_free, is_published) VALUES
(
  (SELECT id FROM instructors WHERE slug = 'carlos-mendoza'),
  'Meditación para Calmar la Mente',
  'meditacion-calmar-mente',
  'Una meditación guiada de 10 minutos perfecta para momentos de estrés o antes de reuniones importantes.',
  '/placeholder.svg?height=400&width=600',
  '76979871',
  10,
  'todos',
  'suave',
  'meditacion',
  ARRAY[]::TEXT[],
  ARRAY['mente', 'relajacion'],
  true,
  true
),
(
  (SELECT id FROM instructors WHERE slug = 'ana-lucia-vega'),
  'Movilidad de Cadera',
  'movilidad-cadera',
  'Libera la tensión acumulada en las caderas con esta secuencia especializada. Ideal después de largas horas sentado.',
  '/placeholder.svg?height=400&width=600',
  '76979871',
  20,
  'todos',
  'suave',
  'movimiento',
  ARRAY['mat'],
  ARRAY['caderas', 'espalda baja'],
  false,
  true
),
(
  (SELECT id FROM instructors WHERE slug = 'carlos-mendoza'),
  'Respiración Box Breathing',
  'box-breathing',
  'Técnica de respiración usada por Navy SEALs para mantener la calma bajo presión. Aprende a regular tu sistema nervioso.',
  '/placeholder.svg?height=400&width=600',
  '76979871',
  8,
  'todos',
  'suave',
  'respiracion',
  ARRAY[]::TEXT[],
  ARRAY['estres', 'enfoque'],
  true,
  true
);

-- Update program class counts
UPDATE programs SET total_classes = (
  SELECT COUNT(*) FROM classes WHERE classes.program_id = programs.id
);
