import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Clock, Play, BarChart } from "lucide-react"

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
    <main className="min-h-screen bg-white pb-24">
      
      {/* SECCIÓN 1: FOTO FULL WIDTH TOTAL (ROMPE EL LAYOUT) */}
      <div className="relative w-full h-[65vh] lg:h-[85vh] overflow-hidden">
        <div className="absolute inset-0 w-[100vw] left-1/2 -translate-x-1/2">
          <img 
            src={program.cover_image_url || "/placeholder-yoga.jpg"} 
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* SECCIÓN 2: TÍTULO GIGANTE */}
        <header className="py-24 border-b border-zinc-100 mb-20">
          <h1 className="text-7xl md:text-[140px] font-cormorant italic text-zinc-900 leading-[0.75] tracking-tighter">
            {program.title}
          </h1>
          <p className="mt-10 text-2xl font-cormorant italic text-zinc-500">
            Con {program.instructors?.name}
          </p>
        </header>

        {/* SECCIÓN 3: DESCRIPCIÓN E INTRODUCCIÓN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-20 mb-32 items-start">
          <div className="lg:col-span-5 space-y-8">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">The Experience</h3>
            <p className="text-zinc-600 leading-[1.8] text-xl font-light italic">
              {program.description}
            </p>
            <div className="flex gap-8 pt-8 border-t border-zinc-100">
              <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Nivel <span className="text-zinc-900 ml-2">{program.difficulty}</span></div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Clases <span className="text-zinc-900 ml-2">{program.classes?.length || 0}</span></div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="aspect-video bg-zinc-50 shadow-2xl rounded-sm overflow-hidden">
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
          <h2 className="text-4xl font-cormorant italic text-zinc-900 mb-16">Estructura del Programa</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {program.classes?.map((clase: any, index: number) => (
              <Link href={`/clases/${clase.slug || clase.id}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-100 mb-6 relative overflow-hidden transition-all duration-700 group-hover:shadow-2xl">
                  <img src={clase.thumbnail_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={clase.title} />
                  <div className="absolute top-0 left-0 bg-white px-3 py-2 text-[10px] font-bold text-zinc-900">{index + 1}</div>
                </div>
                <h3 className="text-lg font-medium text-zinc-900 group-hover:text-zinc-500 transition-colors italic font-cormorant text-2xl">{clase.title}</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 mt-2">{clase.duration} MIN — {program.difficulty}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
