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
    <main className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Estilo Santuario */}
        <header className="mb-20 border-b border-zinc-100 pb-12">
          <h1 className="text-7xl md:text-9xl font-cormorant italic capitalize text-zinc-900 mb-6 tracking-tighter">
            {experience}
          </h1>
          <p className="text-zinc-500 font-light italic text-xl max-w-md leading-relaxed">
            Sistemas de bienestar diseñados para elevar la vida de quienes lideran.
          </p>
        </header>

        {/* Listado de Programas */}
        {contents && contents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {contents.map((item) => (
              <Link href={`/programas/${item.slug}`} key={item.id} className="group flex flex-col gap-6">
                {/* Portada de Lujo */}
                <div className="aspect-[4/5] bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2 flex items-center justify-center relative">
                   <span className="text-[10px] tracking-[0.5em] text-zinc-300 uppercase font-bold group-hover:text-zinc-500 transition-colors">
                     Santuario Edition
                   </span>
                   {/* Badge flotante para Enfoque */}
                   <div className="absolute bottom-6 left-6">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-zinc-900 border border-zinc-100">
                        {item.focus_area || "Premium"}
                      </span>
                   </div>
                </div>

                {/* Textos Informativos */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">
                      {item.category || "Programa"}
                    </span>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-300 font-bold">
                      {item.difficulty}
                    </span>
                  </div>
                  <h3 className="text-3xl font-cormorant italic text-zinc-900 leading-tight group-hover:text-zinc-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 font-light italic">
                    Sesión dirigida por {item.instructors?.name || "Staff Santuario"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center border-t border-zinc-100">
            <p className="font-cormorant italic text-zinc-300 text-3xl">Próximamente contenido exclusivo.</p>
          </div>
        )}
      </div>
    </main>
  )
}
