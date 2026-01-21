import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProfileClient from "./profile-client"

export const metadata = {
  title: "Mi Cuenta | Wellness Platform",
  description: "Gestiona tu perfil y preferencias",
}

export default async function MiCuentaPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/mi-cuenta")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get stats
  const { count: completedCount } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completed", true)

  const { count: favoritesCount } = await supabase
    .from("user_favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  // Calculate total watch time
  const { data: progressData } = await supabase.from("user_progress").select("progress_seconds").eq("user_id", user.id)

  const totalMinutes = Math.round((progressData?.reduce((acc, p) => acc + (p.progress_seconds || 0), 0) || 0) / 60)

  const stats = {
    completedClasses: completedCount || 0,
    favoritesCount: favoritesCount || 0,
    totalMinutes,
    memberSince: profile?.created_at,
  }

  return <ProfileClient user={user} profile={profile} stats={stats} />
}
