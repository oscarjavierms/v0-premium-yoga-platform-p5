# Esquema de Base de Datos - Wellness Platform

## Tablas

### profiles
Perfil de usuarios vinculado a auth.users de Supabase.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | Referencias auth.users.id |
| email | text | Email del usuario |
| full_name | text | Nombre completo |
| avatar_url | text | URL de avatar |
| role | text | 'admin' \| 'instructor' \| 'user' |
| created_at | timestamptz | Fecha de creación |
| updated_at | timestamptz | Última actualización |

### instructors
Profesores/instructores de la plataforma.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | ID único |
| name | text | Nombre del instructor |
| slug | text (unique) | URL amigable |
| bio | text | Biografía |
| specialty | text[] | Especialidades |
| avatar_url | text | Foto del instructor |
| instagram_url | text | Link de Instagram |
| created_at | timestamptz | Fecha de creación |

### programs
Programas (colecciones de clases).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | ID único |
| title | text | Título del programa |
| slug | text (unique) | URL amigable |
| description | text | Descripción |
| thumbnail_url | text | Imagen de portada |
| duration_weeks | integer | Duración en semanas |
| difficulty | text | 'beginner' \| 'intermediate' \| 'advanced' |
| pillar | text | Categoría de bienestar |
| instructor_id | uuid (FK) | Instructor asignado |
| is_featured | boolean | Destacado en home |
| is_published | boolean | Visible para usuarios |
| created_at | timestamptz | Fecha de creación |

### classes
Clases individuales con video de Vimeo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | ID único |
| title | text | Título de la clase |
| slug | text (unique) | URL amigable |
| description | text | Descripción |
| thumbnail_url | text | Imagen de portada |
| vimeo_id | text | ID del video en Vimeo |
| duration_minutes | integer | Duración en minutos |
| difficulty | text | Nivel de dificultad |
| pillar | text | Categoría de bienestar |
| instructor_id | uuid (FK) | Instructor |
| program_id | uuid (FK) | Programa padre (opcional) |
| program_order | integer | Orden dentro del programa |
| is_free | boolean | Accesible sin suscripción |
| is_published | boolean | Visible para usuarios |
| created_at | timestamptz | Fecha de creación |

### user_progress
Progreso de usuarios en las clases.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | ID único |
| user_id | uuid (FK) | Usuario |
| class_id | uuid (FK) | Clase |
| progress_seconds | integer | Segundos vistos |
| completed | boolean | Clase completada |
| completed_at | timestamptz | Fecha de completado |
| updated_at | timestamptz | Última actualización |

### user_favorites
Clases guardadas como favoritas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | uuid (PK) | ID único |
| user_id | uuid (FK) | Usuario |
| class_id | uuid (FK) | Clase favorita |
| created_at | timestamptz | Fecha de guardado |

---

## Políticas RLS (Row Level Security)

### profiles
- `profiles_select_own`: Usuarios ven su propio perfil
- `profiles_insert_own`: Usuarios crean su perfil
- `profiles_update_own`: Usuarios actualizan su perfil
- `profiles_admin_select_all`: Admins ven todos los perfiles

### instructors
- `instructors_select_all`: Todos pueden ver instructores
- `instructors_admin_*`: Solo admins pueden crear/editar/eliminar

### programs & classes
- `*_select_published`: Usuarios ven contenido publicado
- `*_admin_*`: Solo admins pueden crear/editar/eliminar

### user_progress & user_favorites
- `*_select_own`: Usuario ve solo su progreso/favoritos
- `*_insert_own`: Usuario crea su progreso/favoritos
- `*_update_own`: Usuario actualiza su progreso
- `*_delete_own`: Usuario elimina sus favoritos

---

## Función de seguridad

```sql
-- Evita recursión infinita en políticas RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;
```

---

## Notas importantes

1. **Videos Vimeo**: No se suben archivos a Supabase Storage. Solo se guarda el ID de Vimeo.
2. **Autenticación**: Usa Supabase Auth con trigger para crear perfil automáticamente.
3. **Roles**: Verificar rol en middleware y en políticas RLS para doble seguridad.
