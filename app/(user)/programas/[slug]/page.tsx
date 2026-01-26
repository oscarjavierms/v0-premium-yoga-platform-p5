"use client"

import { createClient } from "@/lib/supabase/client"
import { notFound, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = createClient()
  const router = useRouter()
  const [program, setProgram] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProgram() {
      const { data, error } = await supabase
        .from("programs")
        .select(`*, instructors (name), classes (*)`)
        .eq("slug", slug)
        .single()
      
      if (error || !data) return setProgram(null)
      setProgram(data)
      setLoading(false)
    }
    fetchProgram()
  }, [slug])

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Por favor, inicia sesión")

    const { error } = await supabase
      .from("user_practice_saved_programs")
      .insert([{ user_id: user.id, program_id: program.id }])

    if (error) {
      if (error.code === '23505') alert("Ya está en tu Santuario")
      else alert("Error al guardar")
    } else {
      router.push('/mi-practica')
    }
  }

  if (loading) return <div className="p-20 text-center font-cormorant italic text-2xl">Santuario...</div>
  if (!program) return notFound()

  const introVideoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-10">
      <div className="w-full">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          
          {/* INFO IZQUIERDA */}
          <div className="lg:col-span-6 pt-0">
            <header className="mb-4">
              <h1 className="text-6xl md:text-7xl font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter mb-2">
                {program.title}
              </h1>
              <p className="text-lg font-cormorant italic text-zinc-400">Por {program.instructors?.name}</p>
            </header>

            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">Descripción</h3>
                <p className="text-zinc-500 leading-relaxed text-[15px] font-light italic whitespace-pre-wrap">{program.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-y-5 gap-x-2 pt-6 border-t border-zinc-100">
                 <div>
                    <span className="block text-xl text-zinc-800 font-cormorant italic leading-none mb-1">Experiencia</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.experience_type || 'Yoga'}</span>
                 </div>
                 <div>
                    <span className="block text-xl text-zinc-800 font-cormorant italic leading-none mb-1">Área de enfoque</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.area_of_focus}</span>
                 </div>
                 <div>
                    <span className="block text-xl text-zinc-800 font-cormorant italic leading-none mb-1">Nivel de práctica</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.practice_level}</span>
                 </div>
                 <div>
                    <span className="block text-xl text-zinc-800 font-cormorant italic leading-none mb-1">Total de clases</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.classes?.length} Sesiones</span>
                 </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: VIDEO + BOTÓN */}
          <div className="lg:col-span-6">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden rounded-sm ring-1 ring-zinc-100 mb-4">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            
            <button 
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 border border-zinc-900 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-500"
            >
              <span className="text-lg">♡</span>
              Guardar en Mi Santuario
            </button>
          </div>
        </section>

        {/* CONTENIDO DE CLASES */}
        <section className="pt-8 border-t border-zinc-100">
          <h2 className="text-xl font-cormorant italic text-zinc-900 mb-6 uppercase tracking-widest">Contenido</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {program.classes?.map((clase: any) => (
              <Link href={`/clases/${clase.slug}`} key={clase.id} className="group">
                <div className="aspect-[16/10] bg-zinc-50 mb-2 overflow-hidden shadow-sm transition-all duration-700 group-hover:shadow-lg">
                  <img src={clase.thumbnail_url} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                </div>
                <h3 className="text-[11px] font-medium text-zinc-800 leading-tight tracking-tight uppercase">{clase.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
