import { createClient } from "@/lib/supabase/server"
import { MetricsClient } from "./metrics-client"

export const metadata = {
  title: "Métricas | Admin",
}

export default async function AdminMetricasPage() {
  const supabase = await createClient()

  // Get basic counts
  const [{ count: totalUsers }, { count: totalClasses }, { count: totalPrograms }, { count: totalInstructors }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("classes").select("*", { count: "exact", head: true }),
      supabase.from("programs").select("*", { count: "exact", head: true }),
      supabase.from("instructors").select("*", { count: "exact", head: true }),
    ])

  // Get progress stats
  const { data: progressData } = await supabase.from("user_progress").select("*")

  const completedClasses = progressData?.filter((p) => p.completed).length || 0
  const totalWatchTime = progressData?.reduce((acc, p) => acc + (p.progress_seconds || 0), 0) || 0
  const avgWatchTime = progressData?.length ? Math.round(totalWatchTime / progressData.length / 60) : 0

  // Get active users (users with progress in last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentProgress } = await supabase
    .from("user_progress")
    .select("user_id")
    .gte("updated_at", sevenDaysAgo.toISOString())

  const activeUsers7d = new Set(recentProgress?.map((p) => p.user_id)).size

  // Get top classes
  const { data: topClasses } = await supabase
    .from("classes")
    .select(
      `
      id,
      title,
      slug,
      instructor:instructors(name)
    `,
    )
    .eq("is_published", true)
    .limit(10)

  const topClassesWithStats = await Promise.all(
    (topClasses || []).map(async (c) => {
      const [{ count: views }, { count: completions }] = await Promise.all([
        supabase.from("user_progress").select("*", { count: "exact", head: true }).eq("class_id", c.id),
        supabase
          .from("user_progress")
          .select("*", { count: "exact", head: true })
          .eq("class_id", c.id)
          .eq("completed", true),
      ])
      return {
        ...c,
        views: views || 0,
        completions: completions || 0,
      }
    }),
  )

  // Sort by completions
  topClassesWithStats.sort((a, b) => b.completions - a.completions)

  const metrics = {
    totalUsers: totalUsers || 0,
    totalClasses: totalClasses || 0,
    totalPrograms: totalPrograms || 0,
    totalInstructors: totalInstructors || 0,
    completedClasses,
    totalWatchTime: Math.round(totalWatchTime / 60),
    avgWatchTime,
    activeUsers7d,
    topClasses: topClassesWithStats.slice(0, 5),
  }

  return (
    <div className="p-4 lg:p-8">
      <MetricsClient metrics={metrics} />
    </div>
  )
}
