import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MiPracticaClient } from "./mi-practica-client"

export const metadata = {
  title: "Mi Práctica | Tu biblioteca personal",
}

export default async function MiPracticaPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get saved classes
  const { data: savedClasses } = await supabase
    .from("user_practice_saved_classes")
    .select(`
      id,
      created_at,
      classes (
        id,
        title,
        slug,
        thumbnail_url,
        duration_minutes,
        difficulty,
        pillar,
        instructors (name)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Get saved programs
  const { data: savedPrograms } = await supabase
    .from("user_practice_saved_programs")
    .select(`
      id,
      created_at,
      programs (
        id,
        title,
        slug,
        thumbnail_url,
        duration_weeks,
        difficulty,
        pillar,
        instructors (name)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  // Get completed classes (history)
  const { data: historyData } = await supabase
    .from("user_progress")
    .select(`
      id,
      completed_at,
      progress_seconds,
      classes (
        id,
        title,
        slug,
        thumbnail_url,
        duration_minutes,
        difficulty,
        pillar,
        instructors (name)
      )
    `)
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("completed_at", { ascending: false })

  return (
    <MiPracticaClient
      savedClasses={savedClasses?.map(s => ({ ...s.classes, savedAt: s.created_at })).filter(Boolean) || []}
      savedPrograms={savedPrograms?.map(s => ({ ...s.programs, savedAt: s.created_at })).filter(Boolean) || []}
      history={historyData?.map(h => ({ 
        ...h.classes, 
        completedAt: h.completed_at,
        watchedMinutes: Math.round((h.progress_seconds || 0) / 60)
      })).filter(Boolean) || []}
    />
  )
}
