import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CommentSection from "@/components/clases/comment-section"
import { ExpandableText } from "@/components/ui/expandable-text"

function getVideoEmbedUrl(url: string) {
  if (!url) return null;
  if (url.includes('vimeo.com')) {
    const id = url.split('/').pop()?.split('?')[0];
    return `https://player.vimeo.com/video/${id}?h=0&title=0&byline=0&portrait=0`;
  }
  if (url.includes('youtu.be')) {
    const id = url.split('/').pop()?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtube.com')) {
    const urlObj = new URL(url);
    const id = urlObj.searchParams.get('v');
    return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}

export default async function ClasePage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: clase } = await supabase
    .from("classes")
    .select(`
      *,
      instructor:instructor_id(name, slug, avatar_url),
      program:program_id(title, slug)
    `)
    .eq("slug", slug)
    .single()

  if (!clase) return notFound()
  const videoSrc = getVideoEmbedUrl(clase.vimeo_url)

  return (
    <div className="bg-white min-h-screen">
      {/* 1. ESPACIADOR: En móvil es pequeño para que el video suba, en escritorio es 0 */}
      <div className="h-[64px] md:h-0" />

      <main>
        {/* 2. SECCIÓN DE VIDEO: Eliminamos alturas fijas (px) para evitar franjas negras */}
        <section className="w-full bg-black md:-mt-32">
          <div className="max-w-7xl mx-auto md:px-6">
            <div className="max-w-[1100px] mx-auto">
              <div className="relative w-full pb-[56.25%] h-0">
                {videoSrc ? (
                  <iframe
                    src={videoSrc}
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  ></iframe>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-zinc-500 bg-zinc-900 italic text-xs uppercase tracking-widest">
                    Cargando práctica...
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. CONTENIDO: Título y Like */}
        <section className="max-w-6xl mx-auto px-6 py-10 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8">
              <div className="flex justify-between items-start gap-6 mb-8 border-b border-zinc-100 pb-8">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-5xl font-cormorant italic text-zinc-900 leading-[1.1] tracking-tighter">
                    {clase.title}
                  </h1>
                </div>
                
                <button className="flex flex-col items-center group flex-shrink-0 pt-1">
                  <span className="text-2xl transition-transform group-hover:scale-110">❤️</span>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-1">Me gusta</span>
                </button>
              </div>
              
              <div className="prose prose-zinc max-w-none mb-12">
                <ExpandableText maxLines={5}>
                  {clase.description}
                </ExpandableText>
              </div>

              <div className="pt-10">
                <CommentSection claseId={clase.id} />
              </div>
            </div>

            {/* PANEL LATERAL */}
            <div className="lg:col-span-4">
              <aside className="lg:sticky lg:top-32 space-y-8 bg-zinc-50/50 p-8 border border-zinc-100 rounded-sm">
                {[
                  { label: "Experiencia", value: clase.experience_type },
                  { label: "Área de Enfoque", value: clase.focus_area },
                  { label: "Nivel", value: clase.practice_level },
                  { label: "Duración", value: clase.duration_minutes ? `${clase.duration_minutes} min` : null }
                ].map((item, i) => item.value && (
                  <div key={i} className="border-b border-zinc-100 last:border-0 pb-4 last:pb-0">
                    <span className="block text-base text-zinc-800 font-cormorant italic mb-1">{item.label}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{item.value}</span>
                  </div>
                ))}
              </aside>
            </div>

          </div>
        </section>
      </main>
    </div>
  )
}
