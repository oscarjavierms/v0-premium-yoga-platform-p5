import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  // Traemos los nuevos campos desde la base de datos
  const { data: program, error } = await supabase
    .from("programs")
    .select(`
      *, 
      instructors (name, avatar_url), 
      classes (*)
    `)
    .eq("slug", slug)
    .single()

  if (error || !program) return notFound()

  const introVideoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-24">
      <div className="w-full">
        
        {/* Usamos gap-12 y ajustamos columnas para que el video sea más pequeño y el texto esté cerca */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          
          {/* COLUMNA IZQUIERDA: INFORMACIÓN (7 columnas para que el texto sea el foco) */}
          <div className="lg:col-span-7 pt-0">
            <header className="mb-6">
              <h1 className="text-6xl md:text-7xl font-cormorant italic text-zinc-900 leading-[0.85] tracking-tighter mb-4">
                {program.title}
              </h1>
              <div className="flex flex-wrap gap-4 items-center">
                <p className="text-xl font-cormorant italic text-zinc-400">
                  Por {program.instructors?.name}
                </p>
                <span className="px-3 py-1 bg-zinc-50 text-[10px] font-bold uppercase tracking-widest text-zinc-400 border border-zinc-100">
                  {program.experience_type || 'Yoga'}
                </span>
              </div>
            </header>

            <div className="mt-12 space-y-10">
              {/* DESCRIPCIÓN */}
              <div className="space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-300">Descripción</h3>
                <p className="text-zinc-500 leading-relaxed text-[16px] font-light italic whitespace-pre-wrap lg:max-w-2xl">
                  {program.description}
                </p>
              </div>

              {/* ÁREA DE ENFOQUE */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-300">Área de enfoque</h3>
                <p className="text-zinc-800 font-cormorant italic text-xl">
                  {program.area_of_focus || 'Bienestar Integral'}
                </p>
              </div>
              
              {/* METADATOS TÉCNICOS */}
              <div className="flex flex-wrap gap-12 pt-8 border-t border-zinc-100">
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300 mb-1">Nivel de práctica</span>
                    <span className="text-sm text-zinc-500 italic font-light">{program.difficulty || 'Principiante'}</span>
                 </div>
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300 mb-1">Total de clases</span>
                    <span className="text-sm text-zinc-500 italic font-light">{program.classes?.length || 0} Sesiones</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VIDEO (Reducido a 5 columnas para ser un 20% más pequeño) */}
          <div className="lg:col-span-5 lg:sticky lg:top-40">
            <div className="aspect-video bg-zinc-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden rounded-sm ring-1 ring-zinc-100">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            <p className="mt-4 text-[10px] text-center uppercase tracking-[0.3em] text-zinc-300">Video de Introducción</p>
          </div>
        </section>

        {/* CLASES */}
        <section className="pt-20 border-t border-zinc-100">
          <h2 className="text-2xl font-cormorant italic text-zinc-900 mb-12 uppercase tracking-widest text-center">Contenido del programa</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-square bg-zinc-50 mb-3 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-xl">
                  <img src={clase.thumbnail_url} className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={clase.title} />
                </div>
                <h3 className="text-[13px] font-medium text-zinc-800 leading-tight tracking-tight">{clase.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
