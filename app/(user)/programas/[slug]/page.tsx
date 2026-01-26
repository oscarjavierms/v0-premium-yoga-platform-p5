import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { SectionHero } from "@/components/ui/section-hero"
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
    <div className="relative -mt-32 overflow-x-hidden">
      {/* SECCIÓN HERO: Ajustada para ver a la persona completa */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="" 
          subtitle="" 
          image={program.cover_image_url || "/placeholder-yoga.jpg"} 
          /* focusPosition "center 30%": Centra a la persona y evita cortes superiores */
          focusPosition="center 30%" 
        />
      </div>

      {/* CONTENIDO PRINCIPAL: pt-6 para que el título suba más */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-32">
        
        {/* ENCABEZADO: Título refinado y elevado */}
        <header className="mb-12 border-b border-zinc-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-cormorant text-zinc-900 mb-1 leading-tight">
            {program.title}
          </h1>
          <p className="text-zinc-400 font-light italic text-base uppercase tracking-[0.2em]">
            Con {program.instructors?.name}
          </p>
        </header>

        {/* DESCRIPCIÓN Y VIDEO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-[9px] font-bold uppercase tracking-[0.4em] text-zinc-400">The Experience</h3>
            <p className="text-zinc-600 leading-[1.7] text-lg font-light italic whitespace-pre-wrap">
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
          <h2 className="text-2xl font-cormorant italic text-zinc-900 mb-12 uppercase tracking-widest">Estructura del Programa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-100 mb-4 relative overflow-hidden transition-all duration-700 group-hover:shadow-xl">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-yoga.jpg"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={clase.title} 
                  />
                  <div className="absolute top-0 left-0 bg-white px-2 py-1 text-[9px] font-bold text-zinc-400">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-zinc-800 group-hover:text-zinc-500 transition-colors tracking-tight">
                  {clase.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
