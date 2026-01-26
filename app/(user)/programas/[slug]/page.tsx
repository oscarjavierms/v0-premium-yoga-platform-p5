import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, PlayCircle, Target, BarChart, User } from "lucide-react"

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()
  const { slug } = params

  // Buscamos el programa y traemos los datos del instructor relacionados
  const { data: program, error } = await supabase
    .from("programs")
    .select(`
      *,
      instructors (
        name,
        avatar_url,
        bio
      )
    `)
    .eq("slug", slug)
    .single()

  // Si hay error o no existe, mandamos al 404
  if (error || !program) {
    return notFound()
  }

  // Limpiamos la URL de Vimeo/YouTube para el iframe
  const vimeoId = program.vimeo_url?.split("/").pop()?.split("?v=").pop()

  return (
    <main className="min-h-screen bg-white">
      {/* Navegación Minimalista */}
      <nav className="max-w-7xl mx-auto px-6 py-10">
        <Link 
          href="/yoga" 
          className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-all text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Volver a Yoga
        </Link>
      </nav>

      {/* Hero Video Section (Dylan Werner Style) */}
      <section className="w-full bg-black aspect-video max-h-[80vh] relative overflow-hidden shadow-2xl">
        {vimeoId ? (
          <iframe
            src={`https://www.youtube.com/embed/${vimeoId}?rel=0&showinfo=0&autoplay=0`}
            className="absolute inset-0 w-full h-full scale-[1.01]"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-6 bg-zinc-950">
            <PlayCircle size={60} strokeWidth={0.5} className="opacity-20 animate-pulse" />
            <p className="font-cormorant text-3xl italic tracking-widest uppercase opacity-40">Práctica en preparación</p>
          </div>
        )}
      </section>

      {/* Información Editorial */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400 block">
              {program.category || "Inmersive Experience"}
            </span>
            <h1 className="text-6xl md:text-8xl font-cormorant italic text-zinc-900 leading-[0.9] tracking-tighter">
              {program.title}
            </h1>
            <p className="text-2xl font-cormorant italic text-zinc-500 border-t border-zinc-100 pt-6">
              Con {program.instructors?.name || "Oscar Xavier"}
            </p>
          </div>

          {/* Atributos dinámicos del Admin */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 py-10 border-y border-zinc-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Target size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Enfoque</span>
              </div>
              <p className="text-sm font-medium text-zinc-900">{program.focus_area || "Cuerpo completo"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <BarChart size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Nivel</span>
              </div>
              <p className="text-sm font-medium text-zinc-900 capitalize">{program.difficulty || "Beginner"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <User size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Instructor</span>
              </div>
              <p className="text-sm font-medium text-zinc-900">{program.instructors?.name}</p>
            </div>
          </div>

          <p className="text-zinc-600 leading-[1.8] text-xl font-light italic whitespace-pre-wrap max-w-2xl">
            {program.description}
          </p>
        </div>

        {/* Sidebar de Acción */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-50 p-12 rounded-sm border border-zinc-100 text-center sticky top-12">
            <h3 className="font-cormorant text-4xl italic mb-6">Completar</h3>
            <p className="text-sm text-zinc-500 font-light mb-10 leading-relaxed italic">
              Registra tu progreso diario en Santuario.
            </p>
            <button className="w-full bg-zinc-900 text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-100">
              Marcar Finalizado
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
