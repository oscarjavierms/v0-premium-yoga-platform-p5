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
    /* Mantenemos el -mt-32 para que la foto suba hasta el header */
    <div className="relative -mt-32">
      
      {/* HEMOS CAMBIADO ESTO: 
          Eliminamos el cálculo de -ml-[50vw] que causaba que se viera torcida.
          Usamos w-full y overflow-hidden para un centrado limpio y real.
      */}
      <div className="w-full overflow-hidden">
        <SectionHero 
          title="Yoga" 
          subtitle="EL ARTE DEL MOVIMIENTO CONSCIENTE" 
          image="/hero-zen-landscape.jpg" 
          // Asegúrate de que tu componente SectionHero acepte el align="center" que hicimos antes
        />
      </div>

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
