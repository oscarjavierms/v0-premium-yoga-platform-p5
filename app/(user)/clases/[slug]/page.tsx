import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function ClaseDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params
  const supabase = await createClient()

  // Traemos la clase y los detalles del instructor
  const { data: clase, error } = await supabase
    .from("classes")
    .select(`*, programs (title, slug)`)
    .eq("slug", slug)
    .single()

  if (error || !clase) return notFound()

  // Extraer ID de Vimeo (asumiendo que guardas la URL completa o solo el ID)
  const vimeoId = clase.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* 1. VIDEO PROTAGONISTA (Primer pantallazo) */}
      <section className="w-full mb-10">
        <div className="aspect-video bg-black shadow-2xl overflow-hidden rounded-sm ring-1 ring-zinc-100">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0`}
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* COLUMNA IZQUIERDA: Info y Comunidad */}
        <div className="lg:col-span-8">
          <header className="mb-8">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h1 className="text-5xl md:text-6xl font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter mb-4">
                  {clase.title}
                </h1>
                <Link 
                  href={`/programas/${clase.programs?.slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-zinc-800 transition-colors"
                >
                  Parte del programa: {clase.programs?.title}
                </Link>
              </div>

              {/* BOTÓN DE LIKE */}
              <button className="flex flex-col items-center group">
                <span className="text-2xl text-zinc-300 group-hover:text-red-400 transition-colors">❤</span>
                <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400 group-hover:text-zinc-900">Me gusta</span>
              </button>
            </div>
          </header>

          <div className="space-y-12">
            {/* DESCRIPCIÓN */}
            <div className="space-y-2">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">Sobre esta clase</h3>
              <p className="text-zinc-500 leading-relaxed text-[16px] font-light italic whitespace-pre-wrap max-w-2xl">
                {clase.description}
              </p>
            </div>

            {/* SECCIÓN DE COMENTARIOS (Visual) */}
            <section className="pt-12 border-t border-zinc-100">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900 mb-8">Comunidad</h3>
              
              <div className="mb-10">
                <textarea 
                  placeholder="Comparte tu sentir tras la práctica..."
                  className="w-full p-4 bg-zinc-50 border-none italic text-sm focus:ring-1 focus:ring-zinc-200 min-h-[100px] outline-none"
                />
                <button className="mt-4 px-8 py-3 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors">
                  Publicar Comentario
                </button>
              </div>

              {/* Lista de comentarios (Placeholder) */}
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 shrink-0" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-tighter">Usuario de Santuario</span>
                    <p className="text-sm text-zinc-500 italic font-light mt-1">Esta clase me ayudó a soltar la tensión del día. Gracias.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* COLUMNA DERECHA: FICHA TÉCNICA (Estilos invertidos) */}
        <div className="lg:col-span-4 space-y-8 bg-zinc-50/50 p-8 border border-zinc-100 sticky top-32">
          <div>
            <span className="block text-2xl text-zinc-800 font-cormorant italic leading-none mb-1">Duración</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{clase.duration || '20'} Minutos</span>
          </div>
          <div>
            <span className="block text-2xl text-zinc-800 font-cormorant italic leading-none mb-1">Intensidad</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{clase.intensity || 'Moderada'}</span>
          </div>
          <div>
            <span className="block text-2xl text-zinc-800 font-cormorant italic leading-none mb-1">Implementos</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{clase.equipment || 'Ninguno'}</span>
          </div>
        </div>

      </div>
    </main>
  )
}
