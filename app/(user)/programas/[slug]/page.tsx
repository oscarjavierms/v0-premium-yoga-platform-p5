import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, PlayCircle, Star, Target } from "lucide-react"

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: program } = await supabase
    .from("programs")
    .select("*, instructors(name)")
    .eq("slug", params.slug)
    .single()

  if (!program) notFound()

  const vimeoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href={`/${program.experience_type.toLowerCase()}`} className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors text-xs uppercase tracking-widest font-bold">
          <ChevronLeft size={14} />
          Volver a {program.experience_type}
        </Link>
      </div>

      {/* Header Editorial */}
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 block">
            {program.category || "Premium Content"}
          </span>
          <h1 className="text-5xl md:text-7xl font-cormorant italic text-zinc-900 leading-tight">
            {program.title}
          </h1>
          <div className="flex items-center gap-6 pt-4 border-t border-zinc-100 w-fit mt-6">
            <p className="font-cormorant italic text-xl text-zinc-600">Con {program.instructors?.name}</p>
            <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
            <div className="flex items-center gap-2 bg-zinc-50 px-3 py-1 rounded-full border border-zinc-100">
              <Target size={12} className="text-zinc-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{program.focus_area}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Video Section */}
      <section className="w-full bg-zinc-950 aspect-video max-h-[70vh] relative border-y border-zinc-200 overflow-hidden shadow-2xl">
        {vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0&color=ffffff`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700 gap-4">
            <PlayCircle size={48} strokeWidth={1} className="opacity-20" />
            <p className="font-cormorant text-2xl italic">Próximamente disponible</p>
          </div>
        )}
      </section>

      {/* Info & Details */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-10">
          <h2 className="text-3xl font-cormorant italic text-zinc-900 border-b pb-4">Detalles de la sesión</h2>
          <p className="text-zinc-600 leading-relaxed text-lg font-light whitespace-pre-wrap">
            {program.description}
          </p>
          <div className="pt-6">
             <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Dificultad: {program.difficulty}</span>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-zinc-50 p-10 rounded-[2.5rem] border border-zinc-100 text-center sticky top-8">
            <h3 className="font-cormorant text-3xl italic mb-4">Finalizar Práctica</h3>
            <p className="text-sm text-zinc-500 font-light mb-8">Marca esta sesión como completada para seguir tu progreso diario.</p>
            <button className="w-full bg-black text-white py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
              Completar Sesión
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
