import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import FavoritesClient from "./favorites-client"

export const metadata = {
  title: "Mis Favoritos | Wellness Platform",
  description: "Tus clases guardadas",
}

export default async function FavoritosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/favoritos")
  }

  const { data: favorites } = await supabase
    .from("user_favorites")
    .select(`
      *,
      class:classes(
        *,
        instructor:instructors(id, name, slug, avatar_url),
        program:programs(id, title, slug)
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return <FavoritesClient favorites={favorites || []} userId={user.id} />
}
