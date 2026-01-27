import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function ClasePage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  // ✅ Obtener datos de la clase con todos los campos necesarios
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
      {/* ✅ VIDEO - COMIENZA JUSTO DESPUÉS DEL MENÚ, SIN PADDING TOP */}
      <section className="w-full bg-black">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="aspect-video bg-black shadow-lg overflow-hidden rounded-sm">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0`}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* ✅ CONTENIDO - DEBAJO DEL VIDEO */}
      <section className="w-full bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8">
              <div className="flex justify-between items-start mb-8">
                <div className="flex-1">
                  <h1 className="text-5xl md:text-6xl font-cormorant italic text-zinc-900 tracking-tighter leading-none mb-4">
                    {clase.title}
                  </h1>
                </div>
                <button className="flex flex-col items-center group ml-4 flex-shrink-0">
                  <span className="text-2xl text-zinc-300 group-hover:text-red-400 transition-colors cursor-pointer">❤</span>
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">Me gusta</span>
                </button>
              </div>
              
              <p className="text-zinc-500 italic font-light text-[17px] leading-relaxed mb-12 max-w-2xl">
                {clase.description}
              </p>

              <section className="pt-10 border-t border-zinc-100">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6">Comunidad</h3>
                <textarea 
                  className="w-full p-4 bg-zinc-50 border-none italic text-sm outline-none mb-4 rounded-sm" 
                  placeholder="Comparte tu experiencia..." 
                  rows={4} 
                />
                <button className="bg-zinc-900 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors rounded-sm">
                  Publicar
                </button>
              </section>
            </div>

            {/* ✅ PANEL LATERAL CON DATOS DINÁMICOS */}
            <div className="lg:col-span-4 space-y-6 bg-zinc-50/50 p-8 border border-zinc-100">
              
              {/* ✅ TIPO DE EXPERIENCIA */}
              {clase.experience_type && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Experiencia</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.experience_type}
                  </span>
                </div>
              )}

              {/* ✅ ÁREA DE ENFOQUE */}
              {clase.focus_area && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Área de Enfoque</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.focus_area}
                  </span>
                </div>
              )}

              {/* ✅ NIVEL DE PRÁCTICA */}
              {clase.practice_level && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Nivel</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.practice_level}
                  </span>
                </div>
              )}

              {/* ✅ INTENSIDAD */}
              {clase.intensity && (
                <div>
                  <span className="block text-lg text-zinc-800 font-cormorant italic mb-1">Intensidad</span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                    {clase.intensity.charAt(0).toUpperCase() + clase.intensity.slice(1)}
                  </span>
                </div>
              )}

              {/* ✅ DURACIÓN */}
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
