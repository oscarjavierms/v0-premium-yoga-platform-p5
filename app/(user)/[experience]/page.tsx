import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ExperiencePage({ params }: { params: { experience: string } }) {
  const { experience } = params
  const supabase = await createClient()

  // Normalizamos para buscar: yoga -> Yoga
  const formattedExp = experience.charAt(0).toUpperCase() + experience.slice(1).toLowerCase();

  const { data: contents } = await supabase
    .from("programs")
    .select("*, instructors(name)")
    .eq("experience_type", formattedExp)
    .eq("is_published", true)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-16">
        <h1 className="text-6xl font-cormorant italic capitalize text-zinc-900 mb-4">{experience}</h1>
        <p className="text-zinc-500 font-light italic text-lg">Prácticas diseñadas para tu bienestar.</p>
      </header>

      {contents && contents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {contents.map((item) => (
            <Link href={`/programas/${item.slug}`} key={item.id} className="group flex flex-col gap-4">
              <div className="aspect-video bg-zinc-100 border border-zinc-100 rounded-sm overflow-hidden transition-all group-hover:shadow-md flex items-center justify-center">
                 <span className="text-[10px] tracking-[0.3em] text-zinc-300 uppercase font-bold">Santuario Premium</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-cormorant italic text-zinc-900 leading-tight">{item.title}</h3>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                  <span>{item.instructors?.name}</span>
                  <span>{item.focus_area}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-t border-zinc-100">
          <p className="font-cormorant italic text-zinc-400 text-xl">Próximamente contenido nuevo.</p>
        </div>
      )}
    </div>
  )
}
