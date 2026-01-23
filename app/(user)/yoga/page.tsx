import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { YogaClient } from "./yoga-client"
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
    /* -mt-32: Anula el espacio superior del layout para que la foto toque el Header.
      relative: Para que el posicionamiento de los hijos funcione correctamente.
    */
    <div className="relative -mt-32">
      
      {/* Este DIV "rompe" los márgenes laterales del layout:
        w-screen: Ocupa todo el ancho de la pantalla física.
        left-1/2 -ml-[50vw]: Centra el elemento ignorando los contenedores padres.
      */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="Yoga" 
          subtitle="EL ARTE DEL MOVIMIENTO CONSCIENTE" 
          image="/hero-zen-landscape.jpg" 
        />
      </div>

      {/* Contenido de las clases:
        Aquí volvemos a centrar el contenido y le damos un espacio (py-12) 
        para que se vea elegante debajo de la gran imagen.
      */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <YogaClient 
          classes={classes || []} 
          bookmarkedIds={bookmarkedIds} 
          userId={user.id} 
        />
      </div>
    </div>
  )
}
