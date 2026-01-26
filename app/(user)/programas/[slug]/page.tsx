import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  // En Next.js 15+, params es una Promise, así que usamos await
  const { slug } = await params 
  const supabase = await createClient()

  // Hacemos una consulta más sencilla para evitar el Error 500
  const { data: program, error } = await supabase
    .from("programs")
    .select(`
      *,
      instructors (
        name
      )
    `)
    .eq("slug", slug)
    .single()

  // Si hay un error de base de datos o no hay programa, mostramos 404
  if (error || !program) {
    console.error("Error buscando programa:", error)
    return notFound()
  }

  // Limpiamos el ID de Vimeo/YouTube
  const videoId = program.vimeo_url?.split("/").pop()?.split("?v=").pop()

  return (
    <main className="min-h-screen bg-white">
      <nav className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/yoga" className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-all text-[10px] uppercase tracking-[0.3em] font-bold">
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Volver a Yoga
        </Link>
      </nav>

      {/* Sección del Video */}
      <section className="w-full bg-black aspect-video max-h-[80vh] relative overflow-hidden shadow-2xl">
        {program.vimeo_url ? (
          <iframe
            src={program.vimeo_url.includes('youtube') 
              ? `https://www.youtube.com/embed/${videoId}` 
              : `https://player.vimeo.com/video/${videoId}?h=0&title=0&byline=0&portrait=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500 italic">
            Video no disponible
          </div>
        )}
      </section>

      {/* Detalles del programa */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400 block">
            {program.category || "Santuario Experience"}
          </span>
          <h1 className="text-6xl md:text-8xl font-cormorant italic text-zinc-900 leading-[0.9] tracking-tighter">
            {program.title}
          </h1>
          <div className="pt-8 border-t border-zinc-100 mt-8">
             <p className="text-2xl font-cormorant italic text-zinc-500">
               Con {program.instructors?.name || "Instructor de Santuario"}
             </p>
             <p className="text-zinc-600 leading-[1.8] text-xl font-light italic mt-8 max-w-2xl whitespace-pre-wrap">
               {program.description}
             </p>
          </div>
        </div>
      </section>
    </main>
  )
}
