import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MiSantuarioClient } from "./mi-santuario-client"

export const metadata = {
  title: "Mi Santuario | Tu espacio personal",
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
    .select("full_name, email")
    .eq("id", user.id)
    .single()

  // Get completed classes count
  const { count: completedCount } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completed", true)

  // Get total minutes practiced
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("progress_seconds")
    .eq("user_id", user.id)
    .eq("completed", true)

  const totalMinutes = Math.round(
    (progressData?.reduce((sum, p) => sum + (p.progress_seconds || 0), 0) || 0) / 60
  )

  // Calculate days of practice (unique dates with completed classes)
  const { data: completedClasses } = await supabase
    .from("user_progress")
    .select("completed_at")
    .eq("user_id", user.id)
    .eq("completed", true)
    .order("completed_at", { ascending: false })

  const uniqueDays = new Set(
    completedClasses?.map(c => 
      c.completed_at ? new Date(c.completed_at).toDateString() : null
    ).filter(Boolean)
  ).size

  const userName = profile?.full_name?.split(" ")[0] || user.email?.split("@")[0] || "amigo"

  const metrics = {
    diasConciencia: uniqueDays,
    minutosIntencion: totalMinutes,
    clasesCompletadas: completedCount || 0,
  }

  return (
    <MiSantuarioClient 
      userName={userName}
      metrics={metrics}
    />
  )
}
