import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Play, Clock } from "lucide-react"

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
    /* 1. overflow-x-hidden en el main es OBLIGATORIO para que el ancho extra no cree scroll horizontal */
    <main className="-mt-32 min-h-screen bg-white pb-24 overflow-x-hidden">
      
      {/* 2. SECCIÓN HERO: TRUCO PARA ANCHO TOTAL REAL */}
      <section className="relative w-screen h-[65vh] lg:h-[85vh] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <img 
          src={program.cover_image_url || "/placeholder-yoga.jpg"} 
          alt={program.title}
          /* w-full h-full: Ocupa todo el contenedor expandido.
             object-cover: La imagen se adapta sin estirarse feo.
             object-center: Mantiene a la persona siempre en el medio de la pantalla.
          */
          className="w-full h-full object-cover object-center block"
        />
        {/* Degradado para que el logo superior se lea bien sobre la foto */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent h-60" />
      </section>

      {/* 3. CONTENEDOR DE TEXTO: Aquí volvemos al ancho centrado para el contenido */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* TÍTULO */}
        <header className="py-20 mb-16 border-b border-zinc-100">
          <h1 className="text-7xl md:text-[120px] font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter">
            {program.title}
          </h1>
          <p className="mt-8 text-2xl font-cormorant italic text-zinc-500">
            Con {program.instructors?.name}
          </p>
        </header>

        {/* DESCRIPCIÓN Y VIDEO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">The Experience</h3>
            <p className="text-zinc-600 leading-[1.8] text-xl font-light italic whitespace-pre-wrap">
              {program.description}
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden ring-1 ring-zinc-100 rounded-sm">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* LISTADO DE CLASES */}
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
