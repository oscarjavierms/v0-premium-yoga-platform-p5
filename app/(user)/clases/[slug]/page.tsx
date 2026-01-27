import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function ClasePage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: clase } = await supabase
    .from("classes")
    .select(`*`)
    .eq("slug", slug)
    .single()

  if (!clase) return notFound()

  const vimeoId = clase.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-20">
      <section className="w-full mb-10">
        <div className="aspect-video bg-black shadow-2xl overflow-hidden rounded-sm ring-1 ring-zinc-100">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0`}
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-[1400px] mx-auto px-6">
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-5xl md:text-6xl font-cormorant italic text-zinc-900 tracking-tighter leading-none">
              {clase.title}
            </h1>
            <button className="flex flex-col items-center group">
              <span className="text-2xl text-zinc-300 group-hover:text-red-400 transition-colors cursor-pointer">❤</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400">Me gusta</span>
            </button>
          </div>
          <p className="text-zinc-500 italic font-light text-[17px] leading-relaxed mb-12 max-w-2xl">{clase.description}</p>
        </div>

        {/* BARRA LATERAL DINÁMICA */}
        <div className="lg:col-span-4 space-y-10 bg-zinc-50/50 p-8 border border-zinc-100 sticky top-32 h-fit">
          <div>
            <span className="block text-2xl text-zinc-800 font-cormorant italic mb-1">Experiencia</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
              {clase.experience_type || 'No definido'}
            </span>
          </div>
          
          <div>
            <span className="block text-2xl text-zinc-800 font-cormorant italic mb-1">Area de enfoque</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
              {clase.focus_area || 'No definido'}
            </span>
          </div>

          <div>
            <span className="block text-2xl text-zinc-800 font-cormorant italic mb-1">Nivel de experiencia</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
              {clase.practice_level || 'No definido'}
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
