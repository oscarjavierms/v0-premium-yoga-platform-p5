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
    <main className="min-h-screen bg-white pb-24">
      {/* Contenedor flexible para el video y el texto */}
      <div className="w-full px-6 md:px-12 lg:px-16">
        
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-start mb-24">
          
          {/* COLUMNA IZQUIERDA: DISEÑO EDITORIAL */}
          <div className="lg:col-span-5 pt-1">
            <header className="mb-4">
              <h1 className="text-5xl md:text-7xl font-cormorant italic text-zinc-900 leading-[0.85] tracking-tighter mb-2">
                {program.title}
              </h1>
              <p className="text-sm font-light uppercase tracking-[0.3em] text-zinc-400">
                Un programa de {program.instructors?.name}
              </p>
            </header>

            <div className="mt-10 space-y-8">
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-300">Sobre el curso</h3>
                {/* LETRA PEQUEÑA Y GRIS ELEGANTE */}
                <p className="text-zinc-500 leading-relaxed text-[15px] font-light italic whitespace-pre-wrap max-w-sm">
                  {program.description}
                </p>
              </div>
              
              <div className="flex gap-12 pt-6 border-t border-zinc-50">
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300 mb-1">Dificultad</span>
                    <span className="text-xs text-zinc-400">{program.difficulty || 'Multinivel'}</span>
                 </div>
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300 mb-1">Clases</span>
                    <span className="text-xs text-zinc-400">{program.classes?.length || 0} sesiones</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: EL VIDEO */}
          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] overflow-hidden rounded-sm ring-1 ring-zinc-100">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* CLASES EN GRILLA MODERNA */}
        <section className="pt-20 border-t border-zinc-100">
          <h2 className="text-2xl font-cormorant italic text-zinc-900 mb-12 uppercase tracking-widest">Explorar clases</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-50 mb-4 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-xl">
                  <img src={clase.thumbnail_url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={clase.title} />
                </div>
                <h3 className="text-sm font-medium text-zinc-800 tracking-tight group-hover:text-zinc-400 transition-colors">
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
