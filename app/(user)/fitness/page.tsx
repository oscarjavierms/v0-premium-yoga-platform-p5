import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FitnessClient } from "./fitness-client"

export default async function FitnessPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch fitness classes
  const { data: classes } = await supabase
    .from("classes")
    .select(`
      *,
      instructor:instructors(name, avatar_url)
    `)
    .eq("pillar", "fitness")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  // Fetch user's bookmarks
  const { data: bookmarks } = await supabase
    .from("user_practice_saved_classes")
    .select("class_id")
    .eq("user_id", user.id)

  const bookmarkedIds = new Set(bookmarks?.map(b => b.class_id) || [])

  return <FitnessClient classes={classes || []} bookmarkedIds={bookmarkedIds} userId={user.id} />
}
