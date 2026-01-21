import { createClient } from "@/lib/supabase/server"
import { Video, BookOpen, Users, TrendingUp, Eye, Clock, AlertCircle, Play } from "lucide-react"
import { StatCard } from "./components/stat-card"
import { EmptyState } from "./components/empty-state"

export const metadata = {
  title: "Admin Dashboard | Wellness Platform",
}

async function safeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any; count?: number | null }>,
): Promise<{ data: T | null; count: number | null; error: boolean }> {
  try {
    const result = await queryFn()
    return { data: result.data, count: result.count ?? null, error: !!result.error }
  } catch {
    return { data: null, count: null, error: true }
  }
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch stats with error handling
  const [profilesResult, classesResult, programsResult, instructorsResult] = await Promise.all([
    safeQuery(() => supabase.from("profiles").select("*", { count: "exact", head: true })),
    safeQuery(() => supabase.from("classes").select("*", { count: "exact", head: true })),
    safeQuery(() => supabase.from("programs").select("*", { count: "exact", head: true })),
    safeQuery(() => supabase.from("instructors").select("*", { count: "exact", head: true })),
  ])

  const [publishedClassesResult, completedResult] = await Promise.all([
    safeQuery(() => supabase.from("classes").select("*", { count: "exact", head: true }).eq("is_published", true)),
    safeQuery(() => supabase.from("user_progress").select("*", { count: "exact", head: true }).eq("completed", true)),
  ])

  const recentUsersResult = await safeQuery(() =>
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
  )

  const recentProgressResult = await safeQuery(() =>
    supabase
      .from("user_progress")
      .select(`
        *,
        class:classes(title),
        profile:profiles(full_name, email)
      `)
      .order("updated_at", { ascending: false })
      .limit(10),
  )

  // Check which tables are missing
  const missingTables: string[] = []
  if (classesResult.error) missingTables.push("classes")
  if (programsResult.error) missingTables.push("programs")
  if (instructorsResult.error) missingTables.push("instructors")

  const stats = [
    {
      label: "Usuarios totales",
      value: profilesResult.count || 0,
      icon: <Users className="w-5 h-5" />,
      change: "+12%",
    },
    {
      label: "Clases",
      value: classesResult.count || 0,
      icon: <Video className="w-5 h-5" />,
      change: `${publishedClassesResult.count || 0} publicadas`,
    },
    { label: "Programas", value: programsResult.count || 0, icon: <BookOpen className="w-5 h-5" />, change: "" },
    {
      label: "Videos publicados",
      value: publishedClassesResult.count || 0,
      icon: <Play className="w-5 h-5" />,
      change: "",
    },
    { label: "Profesores", value: instructorsResult.count || 0, icon: <Users className="w-5 h-5" />, change: "" },
    {
      label: "Clases completadas",
      value: completedResult.count || 0,
      icon: <TrendingUp className="w-5 h-5" />,
      change: "+28%",
    },
  ]

  const recentUsers = (recentUsersResult.data as any[]) || []
  const recentProgress = (recentProgressResult.data as any[]) || []

  return (
    <div className="p-4 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-medium">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen de la plataforma</p>
      </div>

      {missingTables.length > 0 && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Tablas pendientes de crear</p>
            <p className="text-sm text-amber-700 mt-1">
              Ejecuta los scripts SQL en la carpeta <code className="bg-amber-100 px-1 rounded">/scripts</code> para
              crear: {missingTables.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            change={stat.change || undefined}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Usuarios recientes
          </h2>
          {recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {(user.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user.full_name || "Sin nombre"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(user.created_at).toLocaleDateString("es-ES")}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Users className="w-6 h-6" />}
              title="Sin usuarios"
              description="No hay usuarios registrados aún"
            />
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-medium mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Actividad reciente
          </h2>
          {recentProgress.length > 0 ? (
            <div className="space-y-4">
              {recentProgress.map((progress: any) => (
                <div
                  key={progress.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{progress.class?.title || "Clase"}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {progress.profile?.full_name || progress.profile?.email || "Usuario"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <p className="text-sm font-medium">
                      {progress.completed ? "Completada" : `${Math.round((progress.progress_seconds || 0) / 60)} min`}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3" />
                      {new Date(progress.updated_at).toLocaleDateString("es-ES")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Eye className="w-6 h-6" />}
              title="Sin actividad"
              description="No hay actividad reciente en la plataforma"
            />
          )}
        </div>
      </div>
    </div>
  )
}
