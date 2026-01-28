import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import CommentSection from "@/components/clases/comment-section"
import { ExpandableText } from "@/components/ui/expandable-text"

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

  const vimeoId = clase.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white">
      {/* ✅ VIDEO - SIN ESPACIOS EXTRAS */}
      <section style={{ paddingTop: "0px", paddingBottom: "1rem" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div style={{ maxWidth: "900px", margin: "0 auto" }} className="aspect-video bg-black shadow-lg overflow-hidden rounded-sm">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0`}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ✅ CONTENIDO */}
      <section className="w-full px-6 py-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-cormorant italic text-zinc-900 tracking-tighter leading-tight mb-4">
                    {clase.title}
                  </h1>
                </div>
                <button className="flex flex-col items-center group ml-4 flex-shrink-0">
                  <span className="text-2xl text-zinc-300 group-hover:text-red-400 transition-colors cursor-pointer">❤</span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">Me gusta</span>
                </button>
              </div>
              
              <ExpandableText maxLines={5}>
                {clase.description}
              </ExpandableText>

              <CommentSection claseId={clase.id} />
            </div>

            <div className="lg:col-span-4 space-y-8 bg-zinc-50/50 p-8 border border-zinc-100 h-fit sticky top-32">
              
              {clase.experience_type && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Experiencia</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.experience_type}
                  </span>
                </div>
              )}

              {clase.focus_area && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Área de Enfoque</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.focus_area}
                  </span>
                </div>
              )}

              {clase.practice_level && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Nivel</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.practice_level}
                  </span>
                </div>
              )}

              {clase.intensity && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Intensidad</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.intensity.charAt(0).toUpperCase() + clase.intensity.slice(1)}
                  </span>
                </div>
              )}

              {clase.duration_minutes && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Duración</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.duration_minutes} minutos
                  </span>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
