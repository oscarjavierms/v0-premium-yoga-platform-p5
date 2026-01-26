"use client" // Cambiamos a cliente para manejar el clic del botón

import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function ProgramDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const supabase = createClient()
  const router = useRouter()
  const [program, setProgram] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProgram() {
      const { data } = await supabase
        .from("programs")
        .select(`*, instructors (name), classes (*)`)
        .eq("slug", slug)
        .single()
      setProgram(data)
      setLoading(false)
    }
    getProgram()
  }, [slug])

  const handleSaveToSantuario = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert("Debes iniciar sesión para guardar programas")
      return
    }

    const { error } = await supabase
      .from("user_favorites")
      .insert([
        { user_id: user.id, program_id: program.id }
      ])

    if (error) {
      if (error.code === '23505') alert("Este programa ya está en tu Santuario")
      else alert("Error al guardar")
    } else {
      alert("¡Guardado en Mi Santuario!")
      router.push('/mi-practica')
    }
  }

  if (loading) return <div className="p-20 text-center font-cormorant italic">Cargando...</div>
  if (!program) return <div>Programa no encontrado</div>

  const introVideoId = program.vimeo_url?.split("/").pop()

  return (
    <main className="min-h-screen bg-white pb-10">
      <div className="w-full">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          {/* INFO IZQUIERDA */}
          <div className="lg:col-span-6">
            <header className="mb-4">
              <h1 className="text-6xl md:text-7xl font-cormorant italic text-zinc-900 mb-2">{program.title}</h1>
              <p className="text-lg font-cormorant italic text-zinc-400">Por {program.instructors?.name}</p>
            </header>

            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-900">Descripción</h3>
                <p className="text-zinc-500 leading-relaxed text-[15px] font-light italic">{program.description}</p>
              </div>

              {/* FICHA TÉCNICA REUTILIZADA */}
              <div className="grid grid-cols-2 gap-y-5 pt-6 border-t border-zinc-100">
                 <div>
                    <span className="block text-xl text-zinc-800 font-cormorant italic mb-1">Experiencia</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.experience_type || 'Yoga'}</span>
                 </div>
                 <div>
                    <span className="block text-xl text-zinc-800 font-cormorant italic mb-1">Área de enfoque</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">{program.area_of_focus}</span>
                 </div>
              </div>
            </div>
          </div>

          {/* VIDEO + BOTÓN DERECHA */}
          <div className="lg:col-span-6">
            <div className="aspect-video bg-zinc-50 shadow-2xl overflow-hidden rounded-sm ring-1 ring-zinc-100 mb-4">
              <iframe
                src={`https://player.vimeo.com/video/${introVideoId}?h=0&title=0&byline=0&portrait=0`}
                className="w-full h-full"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* BOTÓN DEBAJO DEL VIDEO */}
            <button 
              onClick={handleSaveToSantuario}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 border border-zinc-900 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-500"
            >
              <span className="text-lg">♡</span>
              Guardar en Mi Santuario
            </button>
          </div>
        </section>

        {/* CLASES... (mismo código de antes) */}
      </div>
    </main>
  )
}
