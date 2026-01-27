import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MeditacionClient } from "./meditacion-client"
import { SectionHero } from "@/components/ui/section-hero"

// ✅ Forzamos datos frescos
export const revalidate = 0

export default async function MeditacionPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  /**
   * ✅ CORRECCIÓN CLAVE: 
   * Buscamos en 'programs' donde 'experience_type' es 'Meditación'
   * Incluimos las clases de cada programa para que MeditacionClient las reciba
   */
  const { data: programs } = await supabase
    .from("programs")
    .select(`
      *,
      instructor:instructor_id(name, avatar_url),
      classes (*)
    `)
    .eq("experience_type", "Meditación") // Coincide con tu Formulario Admin
    .order("created_at", { ascending: false })

  // Aplanamos las clases de todos los programas para pasárselas al Client Component
  // si es que tu MeditacionClient espera una lista de clases sueltas.
  const allMeditationClasses = programs?.flatMap(p => 
    p.classes.map((c: any) => ({
      ...c,
      instructor: p.instructor // Le pasamos el instructor del programa a la clase
    }))
  ) || []

  // Fetch user's bookmarks
  const { data: bookmarks } = await supabase
    .from("user_practice_saved_classes")
    .select("class_id")
    .eq("user_id", user.id)

  const bookmarkedIds = new Set(bookmarks?.map(b => b.class_id) || [])

  return (
    <div className="relative -mt-32">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="Meditación" 
          subtitle="EL SILENCIO ES EL LENGUAJE DEL ALMA" 
          image="/minimalista-me.png" 
          align="center" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* ✅ Ahora 'classes' contiene las que subiste desde Programas */}
        <MeditacionClient 
          classes={allMeditationClasses} 
          bookmarkedIds={bookmarkedIds} 
          userId={user.id} 
        />
      </div>
    </div>
  )
}
