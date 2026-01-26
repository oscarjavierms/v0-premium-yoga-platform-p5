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
    /* Eliminamos el -mt-32 para que el contenido empiece debajo del menú con aire limpio */
    <main className="min-h-screen bg-white pb-24 pt-20">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* ENCABEZADO: Título y Autor */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl font-cormorant italic text-zinc-900 tracking-tight">
            {program.title}
          </h1>
          <div className="h-px w-20 bg-zinc-200 my-6" />
          <p className="text-xl font-cormorant italic text-zinc-500">
            Un programa de {program.instructors?.name}
          </p>
        </header>

        {/* SECCIÓN PRINCIPAL: VIDEO E INTRODUCCIÓN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
          
          {/* Columna Izquierda: Descripción */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">Sobre este programa</h3>
              <p className="text-zinc-600 leading-[1.8] text-xl font-light italic whitespace-pre-wrap">
                {program.description}
              </p>
            </div>
            
            {/* Detalles rápidos (opcional) */}
            <div className="flex gap-8 pt-4 border-t border-zinc-50">
               <div>
                  <span className="block text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Nivel</span>
                  <span className="text-sm text-zinc-600">{program.difficulty || 'Todos los niveles'}</span>
               </div>
               <div>
                  <span className="block text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Sesiones</span>
                  <span className="text-sm text-zinc-600">{program.classes?.length || 0} clases</span>
               </div>
            </div>
          </div>

          {/* Columna Derecha: Video Intro (Ahora es el protagonista visual) */}
          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden ring-1 ring-zinc-100 rounded-sm">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* ESTRUCTURA DE CLASES */}
        <section className="pt-24 border-t border-zinc-100">
          <h2 className="text-3xl font-cormorant italic text-zinc-900 mb-16 tracking-tight">Explorar las clases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-100 mb-6 relative overflow-hidden transition-all duration-700 group-hover:shadow-2xl">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-yoga.jpg"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={clase.title} 
                  />
                  <div className="absolute top-0 left-0 bg-white px-3 py-2 text-[10px] font-bold text-zinc-900">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="text-2xl font-cormorant italic text-zinc-900 group-hover:text-zinc-500 transition-colors tracking-tighter">
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
