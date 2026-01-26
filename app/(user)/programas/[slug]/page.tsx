import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

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
    /* bg-white y pt-6 para que todo suba y se vea limpio */
    <main className="min-h-screen bg-white pb-24 pt-6 overflow-x-hidden">
      
      {/* CONTENEDOR FULL WIDTH: Sin márgenes laterales forzados */}
      <div className="w-full px-6 md:px-10 lg:px-16">
        
        {/* SECCIÓN PRINCIPAL: TÍTULO Y VIDEO BALANCEADOS */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start mb-24">
          
          {/* COLUMNA IZQUIERDA: DISEÑO EDITORIAL */}
          <div className="lg:col-span-5 pt-2">
            <header className="mb-6">
              <h1 className="text-6xl md:text-7xl font-cormorant italic text-zinc-900 leading-none tracking-tighter mb-2">
                {program.title}
              </h1>
              <p className="text-base font-medium uppercase tracking-[0.2em] text-zinc-400">
                {program.instructors?.name}
              </p>
            </header>

            <div className="space-y-10">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-300">Resumen del programa</h3>
                {/* Letra más pequeña, gris elegante y mucho aire entre líneas */}
                <p className="text-zinc-500 leading-relaxed text-base font-light italic whitespace-pre-wrap max-w-md">
                  {program.description}
                </p>
              </div>
              
              {/* METADATOS MINIMALISTAS */}
              <div className="flex gap-12 pt-6 border-t border-zinc-100">
                 <div>
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-300 mb-1">Nivel</span>
                    <span className="text-xs text-zinc-500 font-medium tracking-wide">{program.difficulty || 'Multinivel'}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] uppercase tracking-widest text-zinc-300 mb-1">Sesiones</span>
                    <span className="text-xs text-zinc-500 font-medium tracking-wide">{program.classes?.length || 0} Prácticas</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VIDEO (Tamaño Refinado) */}
          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden rounded-sm ring-1 ring-zinc-100">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* ESTRUCTURA DE CLASES */}
        <section className="pt-20 border-t border-zinc-100">
          <h2 className="text-2xl font-cormorant italic text-zinc-900 mb-16 uppercase tracking-widest">Contenido del Curso</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-50 mb-5 relative overflow-hidden transition-all duration-1000 group-hover:shadow-2xl">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-yoga.jpg"} 
                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
                    alt={clase.title} 
                  />
                  <div className="absolute bottom-0 left-0 bg-white/90 backdrop-blur-sm px-3 py-1 text-[9px] font-bold text-zinc-400">
                    MÓDULO {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="text-lg font-cormorant italic text-zinc-800 group-hover:text-zinc-500 transition-colors">
                  {clase.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
