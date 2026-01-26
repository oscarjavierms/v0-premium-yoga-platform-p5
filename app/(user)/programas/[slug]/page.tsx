import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Clock, Play, Plus, Share2, ThumbsUp } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: program, error } = await supabase
    .from("programs")
    .select(`*, instructors(name, bio, avatar_url)`)
    .eq("slug", slug)
    .single()

  if (error || !program) return notFound()

  const vimeoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* Navegación Minimalista */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <Link href="/yoga" className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-all text-[10px] uppercase tracking-[0.3em] font-bold">
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Volver
        </Link>
        <div className="flex gap-6 text-zinc-400">
          <ThumbsUp size={18} className="hover:text-black cursor-pointer transition-colors" />
          <Share2 size={18} className="hover:text-black cursor-pointer transition-colors" />
          <Plus size={18} className="hover:text-black cursor-pointer transition-colors" />
        </div>
      </nav>

      {/* Hero Video Section - Dylan Werner Style */}
      <section className="w-full bg-zinc-50 aspect-video max-h-[75vh] relative shadow-sm border-b border-zinc-100">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      </section>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header Editorial */}
        <section className="py-16 border-b border-zinc-100">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div className="flex-1 space-y-6">
              <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400 block">Santuario Series</span>
              <h1 className="text-6xl md:text-7xl font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter">
                {program.title}
              </h1>
              <div className="flex items-center gap-4 pt-4">
                <div className="w-10 h-10 rounded-full bg-zinc-200 overflow-hidden">
                   {program.instructors?.avatar_url && (
                     <img src={program.instructors.avatar_url} alt={program.instructors.name} className="w-full h-full object-cover" />
                   )}
                </div>
                <p className="text-lg font-cormorant italic text-zinc-600">Instructor: <span className="text-zinc-900">{program.instructors?.name}</span></p>
              </div>
            </div>
            
            <div className="w-full md:w-80 space-y-8 bg-zinc-50/50 p-8 rounded-sm">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Dificultad</h4>
                <p className="text-sm font-medium uppercase tracking-tight text-zinc-900">{program.difficulty}</p>
              </div>
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Enfoque</h4>
                <p className="text-sm font-medium uppercase tracking-tight text-zinc-900">Movimiento Consciente</p>
              </div>
            </div>
          </div>
        </section>

        {/* Descripción y Metadatos */}
        <section className="py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] mb-8 text-zinc-900">Descripción</h3>
            <p className="text-zinc-600 leading-[2] text-xl font-light italic whitespace-pre-wrap">
              {program.description}
            </p>
          </div>
          
          <div className="lg:col-span-4 space-y-12">
             <div className="p-10 bg-zinc-900 text-white rounded-sm">
                <h4 className="font-cormorant text-3xl italic mb-4">Comenzar Práctica</h4>
                <p className="text-zinc-400 text-sm font-light italic mb-8">Únete a {program.instructors?.name} en este viaje de transformación.</p>
                <button className="w-full border border-white/20 hover:bg-white hover:text-black py-4 text-[10px] font-bold uppercase tracking-[0.3em] transition-all">
                   Marcar progreso
                </button>
             </div>
          </div>
        </section>

        {/* Grilla de Clases / Sesiones (Inspirada en tu imagen de referencia) */}
        <section className="py-24 border-t border-zinc-100">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-cormorant italic text-zinc-900 tracking-tight">Sesiones del Programa</h2>
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest">10 Clases Totales</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-video bg-zinc-100 mb-5 relative overflow-hidden transition-all group-hover:shadow-xl">
                  {/* Thumbnail Placeholder */}
                  <div className="absolute inset-0 bg-zinc-200 flex items-center justify-center opacity-50">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Santuario Media</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 text-[9px] font-bold text-zinc-900">
                    {i}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 text-[9px] font-bold text-white tracking-widest">
                    22:15
                  </div>
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play fill="white" className="text-white" size={40} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-zinc-900 leading-tight group-hover:text-zinc-500 transition-colors">
                    Fuerza y Flexibilidad Parte {i}
                  </h3>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                    <span>{program.instructors?.name}</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {program.difficulty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
