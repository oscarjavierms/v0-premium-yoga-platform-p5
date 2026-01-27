"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Video } from "lucide-react"

export function ProgramForm({ program, instructors }: any) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  
  // Estado para las clases vinculadas
  const [classes, setClasses] = useState<any[]>([])

  useEffect(() => {
    if (program?.classes) {
      setClasses(program.classes)
    }
  }, [program])

  const addClassRow = () => {
    setClasses([...classes, { 
      title: "", 
      description: "", 
      vimeo_url: "", 
      slug: `clase-${Date.now()}`,
      order: classes.length + 1 
    }])
  }

  const updateClass = (index: number, field: string, value: string) => {
    const newClasses = [...classes]
    newClasses[index] = { ...newClasses[index], [field]: value }
    setClasses(newClasses)
  }

  const removeClass = (index: number) => {
    setClasses(classes.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const programData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      experience_type: formData.get("experience_type"),
      area_of_focus: formData.get("area_of_focus"),
      practice_level: formData.get("practice_level"),
      vimeo_url: formData.get("vimeo_url"), // Video de Intro
      instructor_id: formData.get("instructor_id"),
    }

    // 1. Guardar/Actualizar Programa
    const { data: savedProgram, error: pError } = program?.id 
      ? await supabase.from("programs").update(programData).eq("id", program.id).select().single()
      : await supabase.from("programs").insert([programData]).select().single()

    if (pError) {
      alert("Error en programa: " + pError.message)
      setLoading(false)
      return
    }

    // 2. Guardar/Actualizar Clases (Bulk operation)
    // Aquí vinculamos cada clase con el ID del programa guardado
    const classesToSave = classes.map(c => ({
      ...c,
      program_id: savedProgram.id,
      instructor_id: programData.instructor_id // Hereda el instructor por defecto
    }))

    // Nota: Para una app de producción, aquí borrarías las que no están en la lista 
    // y harías un upsert de las nuevas.
    const { error: cError } = await supabase.from("classes").upsert(classesToSave)

    if (!cError) {
      router.push("/admin/programas")
      router.refresh()
    } else {
      alert("Error en clases: " + cError.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* SECCIÓN 1: DATOS MAESTROS DEL PROGRAMA */}
      <section className="bg-white p-8 border border-zinc-100 shadow-sm space-y-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900 border-b border-zinc-100 pb-4">Configuración del Programa</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Título Editorial</label>
            <input name="title" defaultValue={program?.title} className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Slug URL</label>
            <input name="slug" defaultValue={program?.slug} className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900" required />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Área de Enfoque</label>
            <input name="area_of_focus" defaultValue={program?.area_of_focus} className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Nivel de Práctica</label>
            <select name="practice_level" defaultValue={program?.practice_level} className="w-full border-b border-zinc-100 py-2 bg-white outline-none">
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Todos">Todos los niveles</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Instructor Principal</label>
            <select name="instructor_id" defaultValue={program?.instructor_id} className="w-full border-b border-zinc-100 py-2 bg-white outline-none">
              {instructors.map((ins: any) => (
                <option key={ins.id} value={ins.id}>{ins.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">URL Video Introducción (Intro del Programa)</label>
          <input name="vimeo_url" defaultValue={program?.vimeo_url} className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900" />
        </div>
      </section>

      {/* SECCIÓN 2: GESTIÓN DE CLASES (EL CORAZÓN DE TU SOLICITUD) */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">Sesiones del Programa</h2>
            <p className="text-zinc-400 text-[11px] italic mt-1 font-light tracking-wide">Gestiona las clases y su contenido individual</p>
          </div>
          <button 
            type="button" 
            onClick={addClassRow}
            className="flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all"
          >
            <Plus size={14} /> Agregar Clase
          </button>
        </div>

        <div className="space-y-4">
          {classes.map((clase, index) => (
            <div key={index} className="bg-white border border-zinc-100 p-6 shadow-sm group relative">
              <button 
                type="button" 
                onClick={() => removeClass(index)}
                className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Info básica de la clase */}
                <div className="md:col-span-4 space-y-4">
                  <div className="flex items-center gap-2 text-zinc-900 font-cormorant italic text-xl">
                    <span className="text-sm font-sans font-bold not-italic bg-zinc-100 w-6 h-6 flex items-center justify-center rounded-full">
                      {index + 1}
                    </span>
                    Datos de la Sesión
                  </div>
                  <input 
                    placeholder="Título de la clase" 
                    value={clase.title}
                    onChange={(e) => updateClass(index, "title", e.target.value)}
                    className="w-full border-b border-zinc-100 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                  <input 
                    placeholder="URL Video (Vimeo/YouTube)" 
                    value={clase.vimeo_url}
                    onChange={(e) => updateClass(index, "vimeo_url", e.target.value)}
                    className="w-full border-b border-zinc-100 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                </div>

                {/* Descripción y detalles */}
                <div className="md:col-span-8 space-y-4">
                   <textarea 
                    placeholder="Descripción detallada de esta sesión..." 
                    value={clase.description}
                    onChange={(e) => updateClass(index, "description", e.target.value)}
                    rows={3}
                    className="w-full border border-zinc-100 p-3 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {classes.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-zinc-100">
              <p className="text-zinc-400 font-cormorant italic text-xl">Aún no has añadido sesiones a este programa.</p>
            </div>
          )}
        </div>
      </section>

      <div className="pt-10">
        <button 
          disabled={loading}
          className="w-full bg-zinc-900 text-white py-6 text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-zinc-800 transition-all shadow-xl"
        >
          {loading ? "Sincronizando Plataforma..." : "Publicar Programa y Sesiones"}
        </button>
      </div>
    </form>
  )
}
