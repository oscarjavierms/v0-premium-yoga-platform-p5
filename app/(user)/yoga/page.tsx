import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { YogaClient } from "./yoga-client"
import { SectionHero } from "@/components/ui/section-hero"
import Link from "next/link"

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
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="Yoga" 
          subtitle="EL ARTE DEL MOVIMIENTO CONSCIENTE" 
          image="/Bosque-yogaa.png" 
          focusPosition="62% center" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-16">
        <header className="mb-12">
          <h1 className="text-5xl font-cormorant text-zinc-900 mb-2">Yoga</h1>
          <p className="text-zinc-500 font-light italic text-lg">Encuentra equilibrio y fortaleza interior</p>
        </header>

        {/* PROGRAMAS DINÁMICOS ESTILO IMAGEN 3 */}
        {programs && programs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12 mb-20">
            {programs.map((program) => (
              <Link href={`/programas/${program.slug}`} key={program.id} className="group flex flex-col gap-4">
                <div className="aspect-video bg-zinc-100 rounded-sm overflow-hidden relative border border-zinc-100 transition-all group-hover:shadow-md">
                   <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                      <span className="text-[10px] tracking-[0.3em] text-zinc-300 uppercase font-bold">Santuario Program</span>
                   </div>
                   <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-medium">Program</div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-zinc-900 leading-tight group-hover:text-zinc-500">{program.title}</h3>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-light tracking-wide uppercase">
                    <span>{program.instructors?.name}</span>
                    <span className="flex items-center gap-1.5 uppercase tracking-widest">
                      <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                      {program.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="h-[1px] w-full bg-zinc-100 mb-16" />
        
        <YogaClient classes={classes || []} bookmarkedIds={bookmarkedIds} userId={user.id} />
      </div>
    </div>
  )
}
