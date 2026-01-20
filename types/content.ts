export interface Instructor {
  id: string
  name: string
  slug: string
  bio: string | null
  specialty: string | null
  avatar_url: string | null
  credentials: string[] | null
  social_instagram: string | null
  social_website: string | null
  is_active: boolean
  created_at: string
}

export interface Program {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  thumbnail_url: string | null
  cover_url: string | null
  duration_days: number | null
  total_classes: number
  level: "principiante" | "intermedio" | "avanzado" | "todos"
  pillar: "yoga" | "meditacion" | "respiracion" | "movimiento" | "nutricion" | "descanso"
  instructor_id: string | null
  instructor?: Instructor
  is_featured: boolean
  is_published: boolean
  tags: string[] | null
  created_at: string
  classes?: Class[]
}

export interface Class {
  id: string
  program_id: string | null
  instructor_id: string | null
  instructor?: Instructor
  program?: Program
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  vimeo_video_id: string | null
  duration_minutes: number
  level: "principiante" | "intermedio" | "avanzado" | "todos"
  intensity: "suave" | "moderado" | "intenso"
  pillar: "yoga" | "meditacion" | "respiracion" | "movimiento" | "nutricion" | "descanso"
  day_number: number | null
  sequence: number | null
  equipment: string[] | null
  focus_areas: string[] | null
  is_free: boolean
  is_published: boolean
  view_count: number
  tags: string[] | null
  created_at: string
  user_progress?: UserProgress | null
}

export interface UserProgress {
  id: string
  user_id: string
  class_id: string
  program_id: string | null
  watch_position_seconds: number
  watch_percentage: number
  is_completed: boolean
  completed_at: string | null
  last_watched_at: string
  total_watch_time_seconds: number
}

export interface UserFavorite {
  id: string
  user_id: string
  class_id: string
  created_at: string
}

export type PillarType = "yoga" | "meditacion" | "respiracion" | "movimiento" | "nutricion" | "descanso"
export type LevelType = "principiante" | "intermedio" | "avanzado" | "todos"
export type IntensityType = "suave" | "moderado" | "intenso"

export const PILLAR_LABELS: Record<PillarType, string> = {
  yoga: "Yoga",
  meditacion: "Meditación",
  respiracion: "Respiración",
  movimiento: "Movimiento",
  nutricion: "Nutrición",
  descanso: "Descanso",
}

export const LEVEL_LABELS: Record<LevelType, string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
  todos: "Todos los niveles",
}

export const INTENSITY_LABELS: Record<IntensityType, string> = {
  suave: "Suave",
  moderado: "Moderado",
  intenso: "Intenso",
}
