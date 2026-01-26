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
    <main className="min-h-screen bg-white pb-24 overflow-x-hidden">
      
      {/* SECCIÓN 1: Imagen Full Width (Impacto Total) */}
      <section className="relative w-screen left-[50%] right-[50%] ml-[-50vw] mr-[-50vw] h-[70vh] lg:h-[85vh]">
        <img 
          src={program.cover_image_url || "/placeholder-yoga.jpg"} 
          alt={program.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </section>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECCIÓN 2: Título Editorial (Sin Santuario Series) */}
        <header className="py-16 mb-16 border-b border-zinc-100">
          <h1 className="text-7xl md:text-[120px] font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter">
            {program.title}
          </h1>
          <p className="mt-8 text-2xl font-cormorant italic text-zinc-500">
            Con {program.instructors?.name}
          </p>
        </header>

        {/* SECCIÓN 3: Descripción e Introducción */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32 items-center">
          {/* Izquierda: Texto */}
          <div className="lg:col-span-5">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900 mb-8">
              Práctica Consciente
            </h3>
            <p className="text-zinc-600 leading-[1.9] text-xl font-light italic whitespace-pre-wrap">
              {program.description}
            </p>
            <div className="flex gap-10 mt-12 border-t border-zinc-100 pt-8">
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Nivel <span className="text-zinc-900 ml-2">{program.difficulty}</span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Sesiones <span className="text-zinc-900 ml-2">{program.classes?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Derecha: Video Intro */}
          <div className="lg:col-span-7 aspect-video bg-zinc-50 shadow-2xl overflow-hidden group">
            <iframe
              src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        </section>

        {/* SECCIÓN 4: Clases */}
        <section className="pt-24 border-t border-zinc-100">
          <h2 className="text-4xl font-cormorant italic text-zinc-900 mb-16">Estructura del Programa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-100 mb-6 relative overflow-hidden transition-all duration-500 group-hover:shadow-xl">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-class.jpg"} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt={clase.title}
                  />
                  <div className="absolute top-0 left-0 bg-white/90 px-3 py-2 text-[10px] font-bold text-zinc-900">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play fill="white" className="text-white" size={32} />
                  </div>
                </div>
                <h3 className="text-lg font-medium text-zinc-900 mb-2 group-hover:text-zinc-500 transition-colors">
                  {clase.title}
                </h3>
                <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                  <span className="flex items-center gap-1"><Clock size={12} /> {clase.duration} MIN</span>
                  <span className="flex items-center gap-1"><BarChart size={12} /> {program.difficulty}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
