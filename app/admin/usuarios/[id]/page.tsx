import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { UserDetailClient } from "./user-detail-client"

export const metadata = {
  title: "Detalle de Usuario | Admin",
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: user } = await supabase.from("profiles").select("*").eq("id", id).single()

  if (!user) {
    notFound()
  }

  const { data: progress } = await supabase
    .from("user_progress")
    .select(
      `
      *,
      class:classes(title, slug, duration_minutes, pillar)
    `,
    )
    .eq("user_id", id)
    .order("updated_at", { ascending: false })

  const { data: favorites } = await supabase
    .from("user_favorites")
    .select(
      `
      *,
      class:classes(title, slug)
    `,
    )
    .eq("user_id", id)

  return (
    <div className="p-4 lg:p-8">
      <UserDetailClient user={user} progress={progress || []} favorites={favorites || []} />
    </div>
  )
}
