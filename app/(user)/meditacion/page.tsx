import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MeditacionClient } from "./meditacion-client"
// 1. Importamos el componente Hero
import { SectionHero } from "@/components/ui/section-hero"

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

  return (
    /* -mt-32: Anula el padding del layout para pegar la imagen al Header blanco.
       relative: Mantiene el flujo correcto de la página.
    */
    <div className="relative -mt-32">
      
      {/* Contenedor de lado a lado (Full Width) */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="Meditación" 
          subtitle="EL SILENCIO ES EL LENGUAJE DEL ALMA" 
          image="/minimalista-me.png" 
        />
      </div>

      {/* Contenido de las clases centrado con espacio elegante */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <MeditacionClient 
          classes={classes || []} 
          bookmarkedIds={bookmarkedIds} 
          userId={user.id} 
        />
      </div>
    </div>
  )
}
