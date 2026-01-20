import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MiSantuarioClient } from "./mi-santuario-client"

export const metadata = {
  title: "Mi Santuario | Tu espacio de bienestar",
}

export default async function MiSantuarioPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get user progress with class details
  const { data: progressData } = await supabase
    .from("user_progress")
    .select(`
      *,
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
    .order("updated_at", { ascending: false })

  // Calculate stats
  const completedClasses = progressData?.filter(p => p.completed) || []
  const inProgressClasses = progressData?.filter(p => !p.completed && p.progress_seconds > 0) || []
  
  // Get unique days with activity (Días de Conciencia)
  const uniqueDays = new Set(
    completedClasses.map(p => 
      new Date(p.completed_at).toDateString()
    )
  ).size

  // Calculate total minutes (Minutos de Intención)
  const totalMinutes = Math.round(
    (progressData?.reduce((acc, p) => acc + (p.progress_seconds || 0), 0) || 0) / 60
  )

  // Get continue watching (last in-progress class)
  const continueWatching = inProgressClasses[0] || null

  // Get recommended classes (random published classes)
  const { data: recommendedClasses } = await supabase
    .from("classes")
    .select(`
      id,
      title,
      slug,
      thumbnail_url,
      duration_minutes,
      difficulty,
      pillar,
      instructors (name)
    `)
    .eq("is_published", true)
    .limit(6)

  return (
    <MiSantuarioClient
      profile={profile}
      stats={{
        diasConciencia: uniqueDays,
        minutosIntencion: totalMinutes,
        clasesCompletadas: completedClasses.length,
      }}
      continueWatching={continueWatching}
      recommendedClasses={recommendedClasses || []}
    />
  )
}
