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
        
        {/* gap-6 reduce la separación entre texto y video al mínimo elegante */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start mb-20">
          
          {/* COLUMNA IZQUIERDA: TEXTO EDITORIAL */}
          <div className="lg:col-span-5 pt-0">
            <header className="mb-2">
              <h1 className="text-6xl md:text-7xl font-cormorant italic text-zinc-900 leading-[0.85] tracking-tighter">
                {program.title}
              </h1>
              <p className="text-lg font-cormorant italic text-zinc-400 mt-1">
                Un programa de {program.instructors?.name}
              </p>
            </header>

            <div className="mt-8 space-y-6">
              <div className="space-y-3">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300">Resumen</h3>
                {/* Texto pequeño, refinado y con ancho controlado para que no se desparrame */}
                <p className="text-zinc-500 leading-relaxed text-[15px] font-light italic whitespace-pre-wrap max-w-md">
                  {program.description}
                </p>
              </div>
              
              <div className="flex gap-10 pt-6 border-t border-zinc-50">
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300">Dificultad</span>
                    <span className="text-xs text-zinc-400 font-medium">{program.difficulty || 'Multinivel'}</span>
                 </div>
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300">Sesiones</span>
                    <span className="text-xs text-zinc-400 font-medium">{program.classes?.length || 0} Prácticas</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VIDEO PROTAGONISTA */}
          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] overflow-hidden rounded-sm ring-1 ring-zinc-100">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* CLASES EN GRILLA DE 5 COLUMNAS */}
        <section className="pt-20 border-t border-zinc-100">
          <h2 className="text-2xl font-cormorant italic text-zinc-900 mb-12 uppercase tracking-widest">Explorar</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-50 mb-3 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-xl">
                  <img src={clase.thumbnail_url} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={clase.title} />
                </div>
                <h3 className="text-sm font-medium text-zinc-800 tracking-tight group-hover:text-zinc-500 transition-colors">
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
