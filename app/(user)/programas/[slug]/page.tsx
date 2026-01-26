import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SaveProgramButton } from "@/components/programs/save-button" // Crearemos este pequeño componente para el botón

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  // Traemos los datos desde el servidor (esto es lo que evita que se quede "cargando")
  const { data: program, error } = await supabase
    .from("programs")
    .select(`*, instructors (name), classes (*)`)
    .eq("slug", slug)
    .single()

  if (error || !program) return notFound()

  const introVideoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-10">
      <div className="w-full">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-12">
          
          {/* COLUMNA IZQUIERDA: INFORMACIÓN */}
          <div className="lg:col-span-6">
            <header className="mb-6">
              <h1 className="text-6xl md:text-7xl font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter mb-4">
                {program.title}
              </h1>
              <p className="text-lg font-cormorant italic text-zinc-400">
                Por {program.instructors?.name}
              </p>
            </header>

            <div className="space-y-8">
              <div className="space-y-2">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">Descripción</h3>
                <p className="text-zinc-500 leading-relaxed text-[15px] font-light italic whitespace-pre-wrap">
                  {program.description}
                </p>
              </div>

              {/* FICHA TÉCNICA INVERTIDA (Como te gusta) */}
              <div className="grid grid-cols-2 gap-y-8 pt-8 border-t border-zinc-100">
                 <div>
                    <span className="block text-2xl text-zinc-800 font-cormorant italic leading-none mb-1">Experiencia</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.experience_type || 'Yoga'}</span>
                 </div>
                 <div>
                    <span className="block text-2xl text-zinc-800 font-cormorant italic leading-none mb-1">Área de enfoque</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.area_of_focus || 'Bienestar'}</span>
                 </div>
                 <div>
                    <span className="block text-2xl text-zinc-800 font-cormorant italic leading-none mb-1">Nivel</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.practice_level || 'Todos'}</span>
                 </div>
                 <div>
                    <span className="block text-2xl text-zinc-800 font-cormorant italic leading-none mb-1">Sesiones</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.classes?.length || 0} Clases</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VIDEO Y BOTÓN (Debajo) */}
          <div className="lg:col-span-6">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden rounded-sm ring-1 ring-zinc-100 mb-6">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* BOTÓN DE GUARDAR (Lógica aislada para no romper la página) */}
            <SaveProgramButton programId={program.id} />
          </div>
        </section>

        {/* LISTA DE CLASES */}
        <section className="pt-12 border-t border-zinc-100">
          <h2 className="text-xl font-cormorant italic text-zinc-900 mb-8 uppercase tracking-widest">Contenido del Programa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {program.classes?.map((clase: any) => (
              <Link href={`/clases/${clase.slug}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-50 mb-3 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-lg">
                  <img src={clase.thumbnail_url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" alt={clase.title} />
                </div>
                <h3 className="text-[11px] font-medium text-zinc-800 uppercase tracking-tight leading-tight">{clase.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
