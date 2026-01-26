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
      
      {/* SECCIÓN HERO: Actúa como una ventana centrada */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden bg-zinc-50">
        <SectionHero 
          title="" 
          subtitle="" 
          image={program.cover_image_url || "/placeholder-yoga.jpg"} 
          /* "center center" asegura que el individuo esté en el medio exacto.
             Si la persona está un poco más arriba en tus fotos, usa "center 40%".
          */
          focusPosition="center center" 
        />
      </div>

      {/* CONTENIDO: pt-4 para que el título esté casi pegado a la foto */}
      <div className="max-w-7xl mx-auto px-6 pt-4 pb-32">
        
        {/* ENCABEZADO: Título minimalista y muy arriba */}
        <header className="mb-10 border-b border-zinc-100 pb-6">
          <h1 className="text-4xl md:text-5xl font-cormorant text-zinc-900 mb-1 tracking-tight">
            {program.title}
          </h1>
          <p className="text-zinc-400 font-light italic text-sm uppercase tracking-[0.3em]">
            Con {program.instructors?.name}
          </p>
        </header>

        {/* RESTO DEL CONTENIDO (Video y Clases) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
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

        <section className="pt-20 border-t border-zinc-100">
          <h2 className="text-2xl font-cormorant italic text-zinc-900 mb-12 uppercase tracking-widest">Estructura</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-100 mb-4 relative overflow-hidden transition-all group-hover:shadow-lg">
                  <img 
                    src={clase.thumbnail_url || "/placeholder-yoga.jpg"} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt={clase.title} 
                  />
                  <div className="absolute top-0 left-0 bg-white px-2 py-1 text-[9px] font-bold text-zinc-400">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
                <h3 className="text-lg font-medium text-zinc-800 group-hover:text-zinc-500 transition-colors">
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
