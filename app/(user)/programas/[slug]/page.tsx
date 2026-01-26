import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, PlayCircle, Target, BarChart, User } from "lucide-react"

export default async function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = await createClient()

  const { data: program, error } = await supabase
    .from("programs")
    .select("*, instructors(name, avatar_url, bio)")
    .eq("slug", slug)
    .single()

  if (error || !program) return notFound()

  // Lógica para detectar el ID del video (funciona con YouTube y Vimeo)
  const isYouTube = program.vimeo_url?.includes('youtube.com') || program.vimeo_url?.includes('youtu.be')
  const videoId = isYouTube 
    ? program.vimeo_url?.split('v=')[1]?.split('&')[0] || program.vimeo_url?.split('/').pop()
    : program.vimeo_url?.split('/').pop()

  const videoSrc = isYouTube
    ? `https://www.youtube.com/embed/${videoId}?rel=0`
    : `https://player.vimeo.com/video/${videoId}?h=0&title=0&byline=0&portrait=0`

  return (
    <main className="min-h-screen bg-white selection:bg-zinc-100">
      <nav className="max-w-7xl mx-auto px-6 py-10">
        <Link href="/yoga" className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-all text-[10px] uppercase tracking-[0.3em] font-bold">
          <ChevronLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Volver a Yoga
        </Link>
      </nav>

      <section className="w-full bg-black aspect-video max-h-[80vh] relative overflow-hidden shadow-2xl">
        <iframe src={videoSrc} className="absolute inset-0 w-full h-full scale-[1.01]" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400 block">{program.category || "Santuario Premium"}</span>
            <h1 className="text-6xl md:text-8xl font-cormorant italic text-zinc-900 leading-[0.9] tracking-tighter">{program.title}</h1>
            <p className="text-2xl font-cormorant italic text-zinc-500 border-t border-zinc-100 pt-6">Con {program.instructors?.name}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 py-10 border-y border-zinc-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400"><Target size={14} /><span className="text-[9px] font-bold uppercase tracking-widest">Enfoque</span></div>
              <p className="text-sm font-medium text-zinc-900">{program.focus_area || "General"}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400"><BarChart size={14} /><span className="text-[9px] font-bold uppercase tracking-widest">Nivel</span></div>
              <p className="text-sm font-medium text-zinc-900 capitalize">{program.difficulty}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-zinc-400"><User size={14} /><span className="text-[9px] font-bold uppercase tracking-widest">Instructor</span></div>
              <p className="text-sm font-medium text-zinc-900">{program.instructors?.name}</p>
            </div>
          </div>

          <p className="text-zinc-600 leading-[1.8] text-xl font-light italic whitespace-pre-wrap max-w-2xl">{program.description}</p>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-zinc-50 p-12 rounded-sm border border-zinc-100 text-center sticky top-12">
            <h3 className="font-cormorant text-4xl italic mb-6">Finalizar</h3>
            <button className="w-full bg-zinc-900 text-white py-5 text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-700 transition-all">Marcar como finalizado</button>
          </div>
        </div>
      </section>
    </main>
  )
}
