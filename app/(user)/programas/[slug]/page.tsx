import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, PlayCircle, Star } from "lucide-react"

// Importamos tu botón de shadcn si lo tienes, si no, usamos un button normal estilizado
export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  // Buscamos el programa en la base de datos por su slug
  const { data: program } = await supabase
    .from("programs")
    .select("*, instructors(name)")
    .eq("slug", params.slug)
    .single()

  // Si no existe el programa, mostramos error 404
  if (!program) notFound()

  // Extraer el ID de Vimeo para el reproductor
  const vimeoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white">
      {/* Navegación Superior - Estilo Minimalista */}
      <nav className="max-w-7xl mx-auto px-6 py-8">
        <Link 
          href={`/${program.experience_type.toLowerCase()}`} 
          className="flex items-center gap-2 text-zinc-400 hover:text-black transition-colors text-xs uppercase tracking-[0.2em] font-medium"
        >
          <ChevronLeft size={14} />
          Volver a {program.experience_type}
        </Link>
      </nav>

      {/* Título y Categoría - Usando tu fuente Cormorant */}
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 block">
            {program.category || "Sesión Premium"}
          </span>
          <h1 className="text-5xl md:text-7xl font-cormorant leading-tight text-zinc-900 italic">
            {program.title}
          </h1>
          <div className="flex items-center gap-6 pt-2 border-t border-zinc-100 w-fit">
            <p className="text-sm font-medium text-zinc-500 italic font-cormorant">
              Con {program.instructors?.name}
            </p>
            <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {program.difficulty}
            </p>
          </div>
        </div>
      </header>

      {/* Contenedor del Video (Vimeo) */}
      <section className="w-full bg-zinc-950 aspect-video max-h-[70vh] relative shadow-2xl overflow-hidden border-y border-zinc-200">
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
            <p className="font-cormorant text-2xl italic">Contenido en preparación</p>
          </div>
        )}
      </section>

      {/* Descripción y Detalles */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-cormorant text-zinc-900 border-b pb-4 italic">
              Sobre la práctica
            </h2>
            <p className="text-zinc-600 leading-relaxed text-lg font-light whitespace-pre-wrap font-sans">
              {program.description}
            </p>
          </div>

          {/* Badge de Enfoque */}
          <div className="flex items-center gap-3 bg-zinc-50 w-fit px-6 py-3 rounded-full border border-zinc-100">
            <Star size={14} className="text-zinc-400" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              Enfoque: {program.focus_area}
            </span>
          </div>
        </div>

        {/* Sidebar de Progreso */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-50 p-10 rounded-[2rem] border border-zinc-100 space-y-6 sticky top-8 text-center">
            <h3 className="font-cormorant text-3xl italic text-zinc-900">Tu Práctica</h3>
            <p className="text-sm text-zinc-500 font-light leading-relaxed font-sans">
              Registra esta sesión para mantener tu constancia y desbloquear nuevos niveles de bienestar.
            </p>
            <button className="w-full bg-black text-white py-5 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200">
              Finalizar Sesión
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
