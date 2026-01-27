"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Plus, Trash2, Wand2 } from "lucide-react"

export function ProgramForm({ program, instructors }: any) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<any[]>([])
  const [slug, setSlug] = useState(program?.slug || "")
  const [title, setTitle] = useState(program?.title || "")

  useEffect(() => {
    if (program?.classes) {
      setClasses(program.classes)
    }
  }, [program])

  // Lógica para generar el Slug automáticamente
  const generateSlug = () => {
    const generated = title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quita acentos
      .replace(/[^a-z0-9 -]/g, '') // Quita caracteres especiales
      .replace(/\s+/g, '-') // Espacios por guiones
      .replace(/-+/g, '-'); // Quita guiones dobles
    setSlug(generated);
  }

  const addClassRow = () => {
    setClasses([...classes, { 
      title: "", 
      description: "", 
      vimeo_url: "", 
      focus_area: "",
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
      slug: slug, // Usamos el estado del slug
      description: formData.get("description"),
      focus_area: formData.get("focus_area"),
      experience_type: formData.get("experience_type"),
      practice_level: formData.get("practice_level"),
      vimeo_url: formData.get("vimeo_url"),
      instructor_id: formData.get("instructor_id"),
    }

    const { data: savedProgram, error: pError } = program?.id 
      ? await supabase.from("programs").update(programData).eq("id", program.id).select().single()
      : await supabase.from("programs").insert([programData]).select().single()

    if (pError) {
      alert("Error en programas: " + pError.message)
      setLoading(false)
      return
    }

    const classesToSave = classes.map(c => ({
      ...c,
      program_id: savedProgram.id,
      instructor_id: programData.instructor_id,
      is_published: true,
      experience_type: programData.experience_type,
      practice_level: programData.practice_level,
    }))

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
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
      <section className="bg-white p-8 border border-zinc-100 shadow-sm space-y-6">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900 border-b border-zinc-100 pb-4">Configuración del Programa</h2>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Título</label>
            <input 
              name="title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Slug (URL)</label>
            <div className="flex gap-2">
              <input 
                name="slug" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900 font-mono text-xs text-zinc-500" 
                required 
              />
              <button
                type="button"
                onClick={generateSlug}
                className="flex items-center gap-1 px-3 py-1 text-[9px] border border-zinc-200 text-zinc-500 hover:bg-zinc-900 hover:text-white transition-all uppercase font-bold"
              >
                <Wand2 size={10} /> Generar
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Experiencia</label>
            <select name="experience_type" defaultValue={program?.experience_type || ""} className="w-full border-b border-zinc-100 py-2 bg-white outline-none focus:border-zinc-900" required>
              <option value="">Seleccionar...</option>
              <option value="Yoga">Yoga</option>
              <option value="Meditación">Meditación</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Área de Enfoque</label>
            <input name="focus_area" defaultValue={program?.focus_area || ""} className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900" placeholder="Ej: Espalda" />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Nivel</label>
            <select name="practice_level" defaultValue={program?.practice_level || ""} className="w-full border-b border-zinc-100 py-2 bg-white outline-none">
              <option value="">Seleccionar...</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
              <option value="Todos">Todos</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Instructor</label>
            <select name="instructor_id" defaultValue={program?.instructor_id || ""} className="w-full border-b border-zinc-100 py-2 bg-white outline-none">
              <option value="">Seleccionar...</option>
              {instructors.map((ins: any) => (
                <option key={ins.id} value={ins.id}>{ins.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">URL Video Intro</label>
          <input name="vimeo_url" defaultValue={program?.vimeo_url || ""} className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Descripción</label>
          <textarea name="description" defaultValue={program?.description || ""} rows={3} className="w-full border border-zinc-100 p-3 outline-none focus:border-zinc-900" />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-zinc-100 pb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900">Sesiones del Programa</h2>
          <button type="button" onClick={addClassRow} className="bg-zinc-900 text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">
            + AGREGAR SESIÓN
          </button>
        </div>

        <div className="space-y-4">
          {classes.map((clase, index) => (
            <div key={index} className="bg-white border border-zinc-100 p-6 relative shadow-sm">
              <button type="button" onClick={() => removeClass(index)} className="absolute top-4 right-4 text-zinc-300 hover:text-red-500">
                <Trash2 size={16} />
              </button>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input 
                  placeholder="Título de la sesión" 
                  value={clase.title} 
                  onChange={(e) => updateClass(index, "title", e.target.value)} 
                  className="border-b border-zinc-100 py-2 text-sm outline-none focus:border-zinc-900" 
                />
                <input 
                  placeholder="URL Video Vimeo" 
                  value={clase.vimeo_url} 
                  onChange={(e) => updateClass(index, "vimeo_url", e.target.value)} 
                  className="border-b border-zinc-100 py-2 text-sm outline-none focus:border-zinc-900" 
                />
              </div>
              <input 
                placeholder="Área de enfoque de esta sesión (ej: Espalda, Caderas)" 
                value={clase.focus_area} 
                onChange={(e) => updateClass(index, "focus_area", e.target.value)} 
                className="w-full border-b border-zinc-100 py-2 text-sm outline-none focus:border-zinc-900" 
              />
            </div>
          ))}
        </div>
      </section>

      <button 
        disabled={loading} 
        className="w-full bg-zinc-900 text-white py-6 text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-zinc-800 transition-all disabled:opacity-50"
      >
        {loading ? "Sincronizando..." : "PUBLICAR TODO"}
      </button>
    </form>
  )
}
