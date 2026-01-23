import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { YogaClient } from "./yoga-client"
// 1. Importamos el componente que creamos
import { SectionHero } from "@/components/ui/section-hero"

export default async function YogaPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch yoga classes
  const { data: classes } = await supabase
    .from("classes")
    .select(`
      *,
      instructor:instructors(name, avatar_url)
    `)
    .eq("pillar", "movement")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  // Fetch user's bookmarks
  const { data: bookmarks } = await supabase
    .from("user_practice_saved_classes")
    .select("class_id")
    .eq("user_id", user.id)

  const bookmarkedIds = new Set(bookmarks?.map(b => b.class_id) || [])

  return (
    <div className="w-full">
      {/* 2. Insertamos el Hero Banner con tu imagen hero-zen-landscape */}
      <SectionHero 
        title="Yoga" 
        subtitle="EL ARTE DEL MOVIMIENTO CONSCIENTE" 
        image="/hero-zen-landscape.jpg" 
      />

      {/* 3. El contenido original aparece debajo del Hero */}
      <div className="px-4">
        <YogaClient 
          classes={classes || []} 
          bookmarkedIds={bookmarkedIds} 
          userId={user.id} 
        />
      </div>
    </div>
  )
}
