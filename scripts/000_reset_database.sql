-- ================================================
-- SCRIPT PARA BORRAR TODA LA BASE DE DATOS
-- ADVERTENCIA: Este script elimina TODOS los datos
-- ================================================

-- Desactivar verificaciones de foreign keys temporalmente
SET session_replication_role = 'replica';

-- ================================================
-- 1. ELIMINAR TODAS LAS POLÍTICAS RLS
-- ================================================
DO $$ 
DECLARE 
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
      pol.policyname, pol.schemaname, pol.tablename);
  END LOOP;
END $$;

-- ================================================
-- 2. ELIMINAR TODOS LOS TRIGGERS
-- ================================================
DO $$ 
DECLARE 
  trg RECORD;
BEGIN
  FOR trg IN 
    SELECT trigger_name, event_object_table 
    FROM information_schema.triggers 
    WHERE trigger_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.%I', 
      trg.trigger_name, trg.event_object_table);
  END LOOP;
END $$;

-- ================================================
-- 3. ELIMINAR TODAS LAS FUNCIONES PERSONALIZADAS
-- ================================================
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- ================================================
-- 4. ELIMINAR TODAS LAS TABLAS (en orden correcto por dependencias)
-- ================================================

-- Tablas dependientes primero
DROP TABLE IF EXISTS public.user_favorites CASCADE;
DROP TABLE IF EXISTS public.user_progress CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;

-- Tablas de contenido
DROP TABLE IF EXISTS public.classes CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.instructors CASCADE;

-- Tabla principal de usuarios
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ================================================
-- 5. ELIMINAR TIPOS PERSONALIZADOS (si existen)
-- ================================================
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.subscription_status CASCADE;
DROP TYPE IF EXISTS public.experience_level CASCADE;

-- ================================================
-- 6. RESTAURAR VERIFICACIONES DE FOREIGN KEYS
-- ================================================
SET session_replication_role = 'origin';

-- ================================================
-- VERIFICACIÓN: Mostrar tablas restantes
-- ================================================
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
