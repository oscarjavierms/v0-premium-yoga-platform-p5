import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: program, error } = await supabase
    .from("programs")
    .select(`*, instructors (name), classes (*)`)
    .eq("slug", slug)
    .single()

  if (error || !program) return notFound()

  const introVideoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-12">
      <div className="w-full">
        
        {/* GAP REDUCIDO AL MÍNIMO (gap-4) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start mb-10">
          
          {/* COLUMNA IZQUIERDA: INFORMACIÓN (6.5 columnas para acercarse más) */}
          <div className="lg:col-span-6 pt-0">
            <header className="mb-4">
              <h1 className="text-6xl md:text-7xl font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter mb-2">
                {program.title}
              </h1>
              <p className="text-lg font-cormorant italic text-zinc-400">
                Por {program.instructors?.name}
              </p>
            </header>

            <div className="space-y-6">
              {/* DESCRIPCIÓN */}
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">Descripción</h3>
                <p className="text-zinc-500 leading-relaxed text-[15px] font-light italic whitespace-pre-wrap">
                  {program.description}
                </p>
              </div>

              {/* FICHA TÉCNICA UNIFORME (Misma fuente y tamaño para todos) */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 pt-6 border-t border-zinc-100">
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300 mb-1">Experiencia</span>
                    <span className="text-base text-zinc-700 italic font-medium font-cormorant">{program.experience_type || 'Yoga'}</span>
                 </div>
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300 mb-1">Área de enfoque</span>
                    <span className="text-base text-zinc-700 italic font-medium font-cormorant">{program.area_of_focus || 'Bienestar Integral'}</span>
                 </div>
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300 mb-1">Nivel de práctica</span>
                    <span className="text-base text-zinc-700 italic font-medium font-cormorant">{program.practice_level || 'Principiante'}</span>
                 </div>
                 <div>
                    <span className="block text-[9px] uppercase tracking-widest text-zinc-300 mb-1">Total de clases</span>
                    <span className="text-base text-zinc-700 italic font-medium font-cormorant">{program.classes?.length || 0} Sesiones</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VIDEO (Ocupa el resto del espacio) */}
          <div className="lg:col-span-6">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden rounded-sm ring-1 ring-zinc-100">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* CONTENIDO DE CLASES */}
        <section className="pt-8 border-t border-zinc-100">
          <h2 className="text-xl font-cormorant italic text-zinc-900 mb-6 uppercase tracking-widest">Contenido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {program.classes?.map((clase: any) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-50 mb-2 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-lg">
                  <img src={clase.thumbnail_url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={clase.title} />
                </div>
                <h3 className="text-[12px] font-medium text-zinc-800 leading-tight">{clase.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
