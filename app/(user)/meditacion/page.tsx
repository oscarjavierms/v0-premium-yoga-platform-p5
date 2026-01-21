import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MeditacionClient } from "./meditacion-client"

export default async function MeditacionPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch meditation classes
  const { data: classes } = await supabase
    .from("classes")
    .select(`
      *,
      instructor:instructors(name, avatar_url)
    `)
    .eq("pillar", "mindfulness")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  // Fetch user's bookmarks
  const { data: bookmarks } = await supabase
    .from("user_practice_saved_classes")
    .select("class_id")
    .eq("user_id", user.id)

  const bookmarkedIds = new Set(bookmarks?.map(b => b.class_id) || [])

  return <MeditacionClient classes={classes || []} bookmarkedIds={bookmarkedIds} userId={user.id} />
}
