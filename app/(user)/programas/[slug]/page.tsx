import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, PlayCircle, Target, BarChart, User, Info } from "lucide-react"

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  // Traemos el programa y los datos del instructor
  const { data: program } = await supabase
    .from("programs")
    .select("*, instructors(name, avatar_url, bio)")
    .eq("slug", params.slug)
    .single()

  if (!program) notFound()

  const vimeoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white font-sans selection:bg-zinc-100 selection:text-zinc-900">
      
      {/* Barra de Navegación Superior */}
      <nav className="max-w-7xl mx-auto px-6 py-10">
        <Link 
          href={`/${program.experience_type.toLowerCase()}`} 
          className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-all text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Volver a {program.experience_type}
        </Link>
      </nav>

      {/* Sección del Video: Estilo Cinematográfico */}
      <section className="w-full bg-black aspect-video max-h-[85vh] relative overflow-hidden">
        {vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?h=0&title=0&byline=0&portrait=0&color=ffffff`}
            className="absolute inset-0 w-full h-full scale-[1.01]"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-500 gap-6 bg-zinc-950">
            <PlayCircle size={60} strokeWidth={0.5} className="opacity-20 animate-pulse" />
            <p className="font-cormorant text-3xl italic tracking-widest uppercase opacity-40">Contenido en curación</p>
          </div>
        )}
      </section>

      {/* Cuerpo de la Página */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
        
        {/* Columna Principal: Información Editorial */}
        <div className="lg:col-span-8 space-y-16">
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400">
                {program.category || "Exclusive Practice"}
              </span>
              <div className="h-[1px] w-12 bg-zinc-100"></div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-cormorant italic text-zinc-900 leading-[0.9] tracking-tighter">
              {program.title}
            </h1>
            
            <p className="text-2xl font-cormorant italic text-zinc-500">
              Guiado por {program.instructors?.name}
            </p>
          </div>

          {/* Grid de Atributos del Admin */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-zinc-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Target size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Enfoque</span>
              </div>
              <p className="text-sm font-medium text-zinc-900">{program.focus_area || "General"}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <BarChart size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Dificultad</span>
              </div>
              <p className="text-sm font-medium text-zinc-900 capitalize">{program.difficulty}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <Info size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Tipo</span>
              </div>
              <p className="text-sm font-medium text-zinc-900">{program.experience_type}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <User size={14} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Clases</span>
              </div>
              <p className="text-sm font-medium text-zinc-900">{program.total_classes || 1} Sesión</p>
            </div>
          </div>

          {/* Descripción Narrativa */}
          <div className="space-y-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-300">Sobre la práctica</h3>
            <p className="text-zinc-600 leading-[1.8] text-xl font-light italic whitespace-pre-wrap max-w-2xl">
              {program.description}
            </p>
          </div>
        </div>

        {/* Columna Lateral: Acción y Instructor */}
        <div className="lg:col-span-4 space-y-12">
          
          {/* Card de Acción Finalizar */}
          <div className="bg-zinc-50 p-12 rounded-sm border border-zinc-100 text-center sticky top-12">
            <h3 className="font-cormorant text-4xl italic mb-6 text-zinc-900">Finalizar Sesión</h3>
            <p className="text-sm text-zinc-500 font-light mb-10 leading-relaxed italic">
              Registra tu progreso en Santuario y mantén el hábito de tu práctica consciente.
            </p>
            <button className="w-full bg-zinc-900 text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-700 transition-all shadow-2xl shadow-zinc-200">
              Completar Práctica
            </button>
          </div>

          {/* Mini Bio Instructor */}
          <div className="px-4 space-y-6">
             <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">Tu Instructor</h4>
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-100 italic font-cormorant">
                   {program.instructors?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-cormorant text-xl italic text-zinc-900">{program.instructors?.name}</p>
                  <p className="text-[9px] text-zinc-400 uppercase tracking-widest">Santuario Collective</p>
                </div>
             </div>
          </div>

        </div>
      </section>
    </main>
  )
}
