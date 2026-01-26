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
    <div className="relative -mt-32">
      {/* SECCIÓN HERO: Imitando exactamente la configuración de tu página de Yoga */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          /* Título oculto o pequeño si prefieres que no aparezca sobre la foto, 
             o puedes poner el título del programa aquí mismo */
          title="" 
          subtitle="" 
          image={program.cover_image_url || "/placeholder-yoga.jpg"} 
          /* focusPosition: Mantiene a la persona centrada como en tu página de Yoga */
          focusPosition="center center" 
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-32">
        
        {/* ENCABEZADO: Título más pequeño y arriba como pediste */}
        <header className="mb-16 border-b border-zinc-100 pb-12">
          <h1 className="text-5xl font-cormorant text-zinc-900 mb-2">
            {program.title}
          </h1>
          <p className="text-zinc-500 font-light italic text-lg uppercase tracking-widest">
            Con {program.instructors?.name}
          </p>
        </header>

        {/* DESCRIPCIÓN Y VIDEO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32 items-start">
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">The Experience</h3>
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
          <h2 className="text-3xl font-cormorant italic text-zinc-900 mb-16">Estructura del Programa</h2>
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
                <h3 className="text-xl font-medium text-zinc-900 group-hover:text-zinc-500 transition-colors">
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
