import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { YogaClient } from "./yoga-client"
import { SectionHero } from "@/components/ui/section-hero"

export default async function YogaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: classes } = await supabase
    .from("classes")
    .select(`*, instructor:instructors(name, avatar_url)`)
    .eq("pillar", "movement")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  const { data: bookmarks } = await supabase
    .from("user_practice_saved_classes")
    .select("class_id")
    .eq("user_id", user.id)

  const bookmarkedIds = new Set(bookmarks?.map(b => b.class_id) || [])

  return (
    <div className="relative -mt-32">
      {/* Contenedor de ancho completo real */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="Yoga" 
          subtitle="EL ARTE DEL MOVIMIENTO CONSCIENTE" 
          image="/Bosque-yogaa.png" 
          focusPosition="62% center" // Ajuste para centrar a la persona
        />
      </div>

      {/* Contenido inferior: py-16 da un espacio de lujo sin huecos excesivos */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <YogaClient 
          classes={classes || []} 
          bookmarkedIds={bookmarkedIds} 
          userId={user.id} 
        />
      </div>
    </div>
  )
}
