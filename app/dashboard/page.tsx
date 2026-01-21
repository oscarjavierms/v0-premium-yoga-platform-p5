import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardClient from "./dashboard-client"

export const metadata = {
  title: "Mi Dashboard | Wellness Platform",
  description: "Tu espacio personal de bienestar",
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch continue watching (in-progress classes)
  const { data: inProgressClasses } = await supabase
    .from("user_progress")
    .select(`
      *,
      class:classes(
        *,
        instructor:instructors(id, name, slug, avatar_url),
        program:programs(id, title, slug)
      )
    `)
    .eq("user_id", user.id)
    .eq("completed", false)
    .gt("progress_seconds", 0)
    .order("updated_at", { ascending: false })
    .limit(4)

  // Fetch user favorites
  const { data: favorites } = await supabase
    .from("user_favorites")
    .select(`
      *,
      class:classes(
        *,
        instructor:instructors(id, name, slug, avatar_url)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(4)

  // Fetch completed classes count
  const { count: completedCount } = await supabase
    .from("user_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("completed", true)

  const { data: recommendedClasses } = await supabase
    .from("classes")
    .select(`
      *,
      instructor:instructors(id, name, slug, avatar_url)
    `)
    .eq("is_published", true)
    .limit(6)

  // Calculate stats
  const stats = {
    completedClasses: completedCount || 0,
    favoritesCount: favorites?.length || 0,
    currentStreak: 0,
  }

  return (
    <DashboardClient
      profile={profile}
      preferences={null}
      inProgressClasses={inProgressClasses || []}
      favorites={favorites || []}
      recommendedClasses={recommendedClasses || []}
      stats={stats}
    />
  )
}
