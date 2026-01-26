import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, Play, BarChart } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: program, error } = await supabase
    .from("programs")
    .select(`*, instructors (name, avatar_url), classes (*)`)
    .eq("slug", slug)
    .single()

  if (error || !program) return notFound()

  const introVideoId = program.vimeo_url?.split("/").pop()

  return (
    // Eliminamos paddings superiores del main para que pegue al menú
    <main className="min-h-screen bg-white pb-24">
      
      {/* SECCIÓN 1: IMAGEN DE LADO A LADO (FULL WIDTH TOTAL) */}
      {/* Usamos w-screen y margin negativo para ignorar cualquier contenedor padre */}
      <section className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[60vh] lg:h-[80vh] bg-zinc-100">
        <img 
          src={program.cover_image_url || "/placeholder-yoga.jpg"} 
          alt={program.title}
          className="w-full h-full object-cover"
        />
        {/* Overlay sutil para que no se vea plano */}
        <div className="absolute inset-0 bg-black/5" />
      </section>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECCIÓN 2: TÍTULO GIGANTE EDITORIAL */}
        <header className="py-20 mb-16">
          <h1 className="text-7xl md:text-[140px] font-cormorant italic text-zinc-900 leading-[0.75] tracking-tighter">
            {program.title}
          </h1>
          <div className="flex items-center gap-4 mt-12">
            <div className="w-8 h-[1px] bg-zinc-300" />
            <p className="text-2xl font-cormorant italic text-zinc-500">
              Con {program.instructors?.name}
            </p>
          </div>
        </header>

        {/* SECCIÓN 3: DESCRIPCIÓN E INTRODUCCIÓN (LADO A LADO) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
          {/* Izquierda: Texto Descriptivo */}
          <div className="lg:col-span-5 space-y-10">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">
                The Experience
              </h3>
              <p className="text-zinc-600 leading-[1.8] text-xl font-light italic whitespace-pre-wrap">
                {program.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-zinc-100">
              <div>
                <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Nivel</p>
                <p className="text-sm font-medium uppercase tracking-tighter">{program.difficulty}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest mb-1">Sesiones</p>
                <p className="text-sm font-medium uppercase tracking-tighter">{program.classes?.length || 0} Clases</p>
              </div>
            </div>
          </div>

          {/* Derecha: Video Intro (Estilo Dylan Werner) */}
          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden ring-1 ring-zinc-100">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: GRILLA DE CLASES */}
        <section className="pt-24 border-t border-zinc-100">
          <h2 className="text-3xl font-cormorant italic text-zinc-900 mb-16 tracking-tight">Clases del Programa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-100 mb-6 relative overflow-hidden transition-all duration-700 group-hover:shadow-2xl">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-class.jpg"} 
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                    alt={clase.title}
                  />
                  <div className="absolute top-0 left-0 bg-white/95 px-4 py-2 text-[11px] font-bold text-zinc-900">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full border border-white/50 flex items-center justify-center backdrop-blur-sm">
                      <Play fill="white" className="text-white ml-1" size={20} />
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2 group-hover:text-zinc-500 transition-colors tracking-tight">
                  {clase.title}
                </h3>
                <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {clase.duration} MIN</span>
                  <span className="flex items-center gap-1.5"><BarChart size={12} /> {program.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
