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
      <div className="w-full">
        
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          
          {/* COLUMNA IZQUIERDA: ESTILO EDITORIAL */}
          <div className="lg:col-span-5 pt-0">
            <header className="mb-2">
              <h1 className="text-5xl md:text-7xl font-cormorant italic text-zinc-900 leading-[0.9] tracking-tighter">
                {program.title}
              </h1>
              <p className="text-lg font-cormorant italic text-zinc-400 mt-1">
                Un programa de {program.instructors?.name}
              </p>
            </header>

            <div className="mt-10 space-y-8">
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300">Sobre el programa</h3>
                {/* LETRA PEQUEÑA Y REFINADA */}
                <p className="text-zinc-500 leading-relaxed text-[15px] font-light italic whitespace-pre-wrap max-w-sm">
                  {program.description}
                </p>
              </div>
              
              <div className="flex gap-10 pt-6 border-t border-zinc-50">
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300">Nivel</span>
                    <span className="text-xs text-zinc-400">{program.difficulty || 'Multinivel'}</span>
                 </div>
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300">Sesiones</span>
                    <span className="text-xs text-zinc-400">{program.classes?.length || 0} prácticas</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VIDEO */}
          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden rounded-sm ring-1 ring-zinc-100">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* CLASES */}
        <section className="pt-20 border-t border-zinc-100">
          <h2 className="text-2xl font-cormorant italic text-zinc-900 mb-12 uppercase tracking-widest">Contenido</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-50 mb-3 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-lg">
                  <img src={clase.thumbnail_url} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={clase.title} />
                </div>
                <h3 className="text-sm font-medium text-zinc-800 tracking-tight">{clase.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
