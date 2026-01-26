import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Clock, Play, BarChart } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  // 1. Traemos el programa y sus clases relacionadas
  const { data: program, error } = await supabase
    .from("programs")
    .select(`
      *,
      instructors (name, avatar_url, bio),
      classes (*) 
    `)
    .eq("slug", slug)
    .single()

  if (error || !program) return notFound()

  // ID del video de introducción
  const introVideoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-24">
      
      {/* SECCIÓN 1: La "Foto Bonita" (Cover Image) */}
      <section className="w-full h-[60vh] lg:h-[70vh] relative overflow-hidden">
        <img 
          src={program.cover_image_url || "/placeholder-yoga.jpg"} 
          alt={program.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" /> {/* Filtro suave para elegancia */}
      </section>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECCIÓN 2: Título Editorial */}
        <header className="py-12 border-b border-zinc-100 mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400 block mb-4">
            Santuario Series
          </span>
          <h1 className="text-7xl md:text-8xl font-cormorant italic text-zinc-900 leading-none tracking-tighter">
            {program.title}
          </h1>
        </header>

        {/* SECCIÓN 3: Descripción e Introducción (Lado a Lado) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
          {/* Izquierda: Descripción */}
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-900 border-b border-zinc-900 pb-2 w-fit">
              Sobre el Programa
            </h3>
            <p className="text-zinc-600 leading-[1.8] text-xl font-light italic whitespace-pre-wrap">
              {program.description}
            </p>
            
            <div className="pt-8 flex items-center gap-6">
              <div className="space-y-1">
                <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest">Nivel</p>
                <p className="text-sm font-medium uppercase">{program.difficulty}</p>
              </div>
              <div className="space-y-1 border-l border-zinc-200 pl-6">
                <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest">Instructor</p>
                <p className="text-sm font-medium uppercase">{program.instructors?.name}</p>
              </div>
            </div>
          </div>

          {/* Derecha: Video de Introducción */}
          <div className="lg:col-span-7 bg-zinc-50 aspect-video relative shadow-2xl rounded-sm overflow-hidden">
             <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
              ></iframe>
          </div>
        </section>

        {/* SECCIÓN 4: Grilla de Clases (Dinámica) */}
        <section className="pt-24 border-t border-zinc-100">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-5xl font-cormorant italic text-zinc-900">Clases del Programa</h2>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-4">
                {program.classes?.length || 0} Sesiones Disponibles
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-20">
            {program.classes?.map((clase: any, index: number) => (
              <Link 
                href={`/clases/${clase.slug || clase.id}`} 
                key={clase.id} 
                className="group cursor-pointer"
              >
                <div className="aspect-video bg-zinc-100 mb-6 relative overflow-hidden transition-transform duration-700 group-hover:scale-[1.02]">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-class.jpg"} 
                    className="w-full h-full object-cover" 
                    alt={clase.title}
                  />
                  <div className="absolute top-4 left-4 bg-white px-2 py-1 text-[10px] font-bold text-zinc-900 shadow-sm">
                    {index + 1}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/90 px-2 py-1 text-[9px] font-bold text-white tracking-widest">
                    {clase.duration || "20:00"}
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
                      <Play fill="white" className="text-white ml-1" size={16} />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-medium text-zinc-900 leading-tight group-hover:text-zinc-500 transition-colors">
                    {clase.title}
                  </h3>
                  <div className="flex items-center gap-4 text-[9px] text-zinc-400 font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Clock size={12} /> {clase.duration}</span>
                    <span className="flex items-center gap-1"><BarChart size={12} /> {program.difficulty}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
