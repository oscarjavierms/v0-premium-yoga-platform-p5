import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { YogaClient } from "./yoga-client"
import { SectionHero } from "@/components/ui/section-hero"
import Link from "next/link"
import { Play } from "lucide-react"

export default async function YogaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // 1. Traemos las clases sueltas (lo que ya tenías)
  const { data: classes } = await supabase
    .from("classes")
    .select(`*, instructor:instructors(name, avatar_url)`)
    .eq("pillar", "movement")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  // 2. Traemos los PROGRAMAS de Yoga (lo nuevo que creamos)
  const { data: programs } = await supabase
    .from("programs")
    .select(`*, instructors(name)`)
    .eq("experience_type", "Yoga")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  const { data: bookmarks } = await supabase
    .from("user_practice_saved_classes")
    .select("class_id")
    .eq("user_id", user.id)

  const bookmarkedIds = new Set(bookmarks?.map(b => b.class_id) || [])

  return (
    <div className="relative -mt-32">
      {/* SECCIÓN HERO (INTACTA) */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="Yoga" 
          subtitle="EL ARTE DEL MOVIMIENTO CONSCIENTE" 
          image="/Bosque-yogaa.png" 
          focusPosition="62% center" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
        
        {/* NUEVA SECCIÓN: PROGRAMAS PREMIUM (Tarjetas Horizontales) */}
        {programs && programs.length > 0 && (
          <div className="mb-20">
            <div className="flex flex-col mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 mb-2">Curated Experience</span>
              <h2 className="text-4xl font-cormorant italic text-zinc-900">Programas de Inmersión</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {programs.map((program) => (
                <Link 
                  href={`/programas/${program.slug}`} 
                  key={program.id}
                  className="group relative h-64 bg-zinc-900 rounded-sm overflow-hidden border border-zinc-800 flex items-end p-8 transition-all hover:border-zinc-400"
                >
                  {/* Overlay Gradiente Premium */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 opacity-80" />
                  
                  {/* Texto decorativo de fondo o imagen placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                     <span className="text-4xl font-cormorant italic text-white tracking-widest uppercase">Santuario</span>
                  </div>

                  <div className="relative z-20 w-full flex justify-between items-end">
                    <div className="space-y-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-400">
                        {program.focus_area || "Yoga Program"}
                      </span>
                      <h3 className="text-2xl font-cormorant italic text-white leading-none">
                        {program.title}
                      </h3>
                      <p className="text-xs text-zinc-500 font-light italic">
                        Con {program.instructors?.name}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black transition-all">
                      <Play size={16} fill="currentColor" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        <hr className="mb-16 border-zinc-100" />

        {/* TUS CLASES ACTUALES (YogaClient) */}
        <div className="mb-8">
           <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">All Sessions</span>
           <h2 className="text-4xl font-cormorant italic text-zinc-900 mt-2">Clases Individuales</h2>
        </div>
        
        <YogaClient 
          classes={classes || []} 
          bookmarkedIds={bookmarkedIds} 
          userId={user.id} 
        />
      </div>
    </div>
  )
}
