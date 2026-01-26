import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

// Esto obliga a Next.js a buscar siempre en la base de datos y evita errores de caché
export const dynamic = 'force-dynamic'

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = await createClient()

  // Buscamos el programa por el slug exacto de la URL
  const { data: program, error } = await supabase
    .from("programs")
    .select("*, instructors(name)")
    .eq("slug", slug)
    .single()

  // Si no existe o hay error, mandamos al 404
  if (error || !program) return notFound()

  const videoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white">
      <nav className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/yoga" className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-all text-[10px] uppercase tracking-[0.3em] font-bold">
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Volver a Yoga
        </Link>
      </nav>

      {/* Video Player */}
      <section className="w-full bg-black aspect-video max-h-[80vh] relative overflow-hidden shadow-2xl">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?h=0&title=0&byline=0&portrait=0`}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      </section>

      {/* Contenido Editorial */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400 block mb-4">
          {program.category || "Inmersive Experience"}
        </span>
        <h1 className="text-6xl md:text-8xl font-cormorant italic text-zinc-900 leading-[0.9] tracking-tighter">
          {program.title}
        </h1>
        <p className="text-2xl font-cormorant italic text-zinc-500 border-t border-zinc-100 pt-6 mt-8">
          Guiado por {program.instructors?.name}
        </p>
        <p className="text-zinc-600 leading-[1.8] text-xl font-light italic mt-12 max-w-2xl">
          {program.description}
        </p>
      </section>
    </main>
  )
}
