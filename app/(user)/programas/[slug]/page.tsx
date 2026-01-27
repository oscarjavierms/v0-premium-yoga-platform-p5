import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SaveProgramButton } from "@/components/programs/save-button"

export const dynamic = 'force-dynamic'

function getVideoEmbedUrl(url: string) {
  if (!url) return null;
  if (url.includes('vimeo.com')) {
    const id = url.split('/').pop();
    return `https://player.vimeo.com/video/${id}?h=0&title=0&byline=0&portrait=0`;
  }
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
    return `https://www.youtube.com/embed/${id}`;
  }
  return null;
}

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: program, error } = await supabase
    .from("programs")
    .select(`*, instructors (name), classes (*)`)
    .eq("slug", slug)
    .single()

  if (error || !program) return notFound()

  const videoSrc = getVideoEmbedUrl(program.vimeo_url);

  return (
    <main className="min-h-screen bg-white pb-10 px-6 -mt-4">
      <div className="max-w-7xl mx-auto pt-4">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-8">
          <div className="lg:col-span-6 space-y-8">
            <header>
              <h1 className="text-5xl md:text-6xl font-cormorant italic text-zinc-900 leading-[0.9] tracking-tighter mb-4">
                {program.title}
              </h1>
              <p className="text-base font-cormorant italic text-zinc-400">Por {program.instructors?.name}</p>
            </header>

            <div className="space-y-4">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">Descripción</h3>
              <p className="text-zinc-500 leading-relaxed text-sm font-light italic whitespace-pre-wrap">
                {program.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-y-10 pt-10 border-t border-zinc-100">
               <div>
                  <span className="block text-xl text-zinc-800 font-cormorant italic leading-none mb-1">Área de Enfoque</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.focus_area || program.area_of_focus}</span>
               </div>
               <div>
                  <span className="block text-xl text-zinc-800 font-cormorant italic leading-none mb-1">Nivel</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.practice_level}</span>
               </div>
               <div>
                  <span className="block text-xl text-zinc-800 font-cormorant italic leading-none mb-1">Sesiones</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.classes?.length || 0} Clases</span>
               </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden rounded-sm ring-1 ring-zinc-100 mb-8">
              {videoSrc && <iframe src={videoSrc} className="w-full h-full" allowFullScreen />}
            </div>
            <SaveProgramButton programId={program.id} />
          </div>
        </section>

        {/* ✅ MUCHO MÁS COMPACTO: pt-2 (espacio mínimo) y mb-4 */}
        <section className="pt-2 border-t border-zinc-100">
          <h2 className="text-lg font-cormorant italic text-zinc-900 mb-4 uppercase tracking-widest">Contenido del Programa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {program.classes?.map((clase: any, i: number) => (
              <Link href={`/clases/${clase.slug}`} key={clase.id} className="group space-y-4">
                <div className="relative aspect-video bg-zinc-100 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-xl rounded-sm">
                  {clase.thumbnail_url && <img src={clase.thumbnail_url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white text-[10px] font-bold uppercase tracking-widest">Ver Clase</div>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">Sesión {i + 1} • {clase.focus_area}</span>
                  <h3 className="text-lg font-cormorant italic text-zinc-800 leading-tight mt-1">{clase.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
