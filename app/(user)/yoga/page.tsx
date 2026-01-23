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
    /* 1. -mt-[128px]: Anula exactamente el espacio blanco superior (32 * 4px).
       2. relative z-0: Asegura que esté por debajo del header pero pegado a él.
    */
    <div className="relative -mt-[128px]">
      
      {/* Contenedor Full Width */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="Yoga" 
          subtitle="EL ARTE DEL MOVIMIENTO CONSCIENTE" 
          image="/hero-zen-landscape.jpg" 
        />
      </div>

      {/* Contenido de las clases: 
          py-12 le da el aire necesario después de la imagen inmersiva 
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
