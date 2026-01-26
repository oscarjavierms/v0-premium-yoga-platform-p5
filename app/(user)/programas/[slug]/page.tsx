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
    <main className="relative w-full min-h-screen bg-white pb-24 overflow-x-hidden">
      
      {/* SECCIÓN 1: FOTO AJUSTADA
          Reducimos h a [55vh] o [65vh] para que el título suba y sea visible.
      */}
      <section className="relative w-screen h-[55vh] lg:h-[70vh] -ml-[max(1.5rem,calc((100vw-100%)/2))] -mr-[max(1.5rem,calc((100vw-100%)/2))] -mt-32 overflow-hidden bg-zinc-100">
        <img 
          src={program.cover_image_url || "/placeholder-yoga.jpg"} 
          alt={program.title}
          /* object-[50%_30%]: Este es el truco. 
             50% centra horizontalmente. 
             30% sube o baja la foto para que la cabeza del instructor no quede tapada por el menú.
          */
          className="w-full h-full object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent h-40" />
      </section>

      {/* CONTENEDOR DE CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* SECCIÓN 2: TÍTULO CON MÁS ESPACIO SUPERIOR (Aire blanco) */}
        <header className="pt-16 pb-20 mb-16 border-b border-zinc-100">
          <h1 className="text-7xl md:text-[100px] font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter">
            {program.title}
          </h1>
          <p className="mt-6 text-2xl font-cormorant italic text-zinc-500">
            Con {program.instructors?.name}
          </p>
        </header>

        {/* SECCIÓN 3: DESCRIPCIÓN Y VIDEO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">The Experience</h3>
            <p className="text-zinc-600 leading-[1.8] text-xl font-light italic whitespace-pre-wrap">
              {program.description}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden ring-1 ring-zinc-100">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* SECCIÓN 4: CLASES */}
        <section className="pt-24 border-t border-zinc-100">
          <h2 className="text-4xl font-cormorant italic text-zinc-900 mb-16 uppercase tracking-tighter">Estructura del Programa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-100 mb-6 relative overflow-hidden transition-all duration-700 group-hover:shadow-2xl">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-yoga.jpg"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={clase.title} 
                  />
                  <div className="absolute top-0 left-0 bg-white px-3 py-2 text-[10px] font-bold text-zinc-900">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="text-2xl font-cormorant italic text-zinc-900 group-hover:text-zinc-500 transition-colors tracking-tighter">
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
