import { createClient } from "@/lib/supabase/server"
import { UsersClient } from "./users-client"

export const metadata = {
  title: "Gestionar Usuarios | Admin",
}

export default async function AdminUsuariosPage() {
  const supabase = await createClient()

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const usersWithStats = await Promise.all(
    (users || []).map(async (user) => {
      const [{ count: completedCount }, { count: totalProgress }] = await Promise.all([
        supabase
          .from("user_progress")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("completed", true),
        supabase.from("user_progress").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      ])

      return {
        ...user,
        completedClasses: completedCount || 0,
        totalProgress: totalProgress || 0,
      }
    }),
  )

  return (
    <div className="p-4 lg:p-8">
      <UsersClient users={usersWithStats} />
    </div>
  )
}
