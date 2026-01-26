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
    <main className="min-h-screen bg-white pb-24 pt-12">
      
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* SECCIÓN PRINCIPAL: TÍTULO Y VIDEO LADO A LADO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start mb-24">
          
          {/* COLUMNA IZQUIERDA: TEXTOS */}
          <div className="lg:col-span-5 pt-2">
            <header className="mb-10">
              <h1 className="text-5xl md:text-6xl font-cormorant italic text-zinc-900 leading-[1.1] tracking-tight">
                {program.title}
              </h1>
              <div className="h-px w-12 bg-zinc-200 my-6" />
              <p className="text-lg font-cormorant italic text-zinc-500">
                Un programa de {program.instructors?.name}
              </p>
            </header>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">Sobre este programa</h3>
                <p className="text-zinc-600 leading-[1.8] text-lg font-light italic whitespace-pre-wrap">
                  {program.description}
                </p>
              </div>
              
              {/* METADATOS: NIVEL Y CLASES */}
              <div className="flex gap-10 pt-6">
                 <div>
                    <span className="block text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-1">Nivel</span>
                    <span className="text-sm font-light text-zinc-600">{program.difficulty || 'Todos los niveles'}</span>
                 </div>
                 <div>
                    <span className="block text-[9px] uppercase tracking-[0.3em] text-zinc-400 font-bold mb-1">Sesiones</span>
                    <span className="text-sm font-light text-zinc-600">{program.classes?.length || 0} clases</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VIDEO */}
          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden rounded-sm ring-1 ring-zinc-100">
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
          <header className="mb-16">
            <h2 className="text-3xl font-cormorant italic text-zinc-900 tracking-tight">Explorar las clases</h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-50 mb-6 relative overflow-hidden transition-all duration-700 group-hover:shadow-xl">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-yoga.jpg"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95 group-hover:opacity-100" 
                    alt={clase.title} 
                  />
                  <div className="absolute top-0 left-0 bg-white px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="text-xl font-cormorant italic text-zinc-900 group-hover:text-zinc-500 transition-colors tracking-tight">
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
