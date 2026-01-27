"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function ProgramForm({ program, instructors }: any) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const programData = {
      title: formData.get("title"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      experience_type: formData.get("experience_type"),
      focus_area: formData.get("focus_area"), // Nuevo
      practice_level: formData.get("practice_level"), // Nuevo
      vimeo_url: formData.get("vimeo_url"),
      instructor_id: formData.get("instructor_id"),
      is_published: formData.get("is_published") === "on",
    }

    const { error } = program?.id 
      ? await supabase.from("programs").update(programData).eq("id", program.id)
      : await supabase.from("programs").insert([programData])

    if (!error) {
      router.push("/admin/programas")
      router.refresh()
    } else {
      alert("Error al guardar: " + error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 border border-zinc-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest">Título</label>
          <input name="title" defaultValue={program?.title} className="w-full p-3 border border-zinc-100 outline-none focus:border-zinc-900" required />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest">Slug (URL)</label>
          <input name="slug" defaultValue={program?.slug} className="w-full p-3 border border-zinc-100 outline-none focus:border-zinc-900" required />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-widest">Descripción</label>
        <textarea name="description" defaultValue={program?.description} rows={4} className="w-full p-3 border border-zinc-100 outline-none focus:border-zinc-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest">Nivel</label>
          <select name="practice_level" defaultValue={program?.practice_level} className="w-full p-3 border border-zinc-100 bg-white">
            <option value="Principiante">Principiante</option>
            <option value="Intermedio">Intermedio</option>
            <option value="Avanzado">Avanzado</option>
            <option value="Todos los niveles">Todos los niveles</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest">Área de Enfoque</label>
          <input name="focus_area" defaultValue={program?.focus_area} placeholder="Ej: Piernas, Espalda" className="w-full p-3 border border-zinc-100 outline-none focus:border-zinc-900" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest">URL Video (Vimeo o YouTube)</label>
          <input name="vimeo_url" defaultValue={program?.vimeo_url} className="w-full p-3 border border-zinc-100 outline-none focus:border-zinc-900" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest">Instructor</label>
          <select name="instructor_id" defaultValue={program?.instructor_id} className="w-full p-3 border border-zinc-100 bg-white">
            {instructors.map((ins: any) => (
              <option key={ins.id} value={ins.id}>{ins.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button disabled={loading} className="w-full bg-zinc-900 text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all">
        {loading ? "Guardando..." : "Actualizar Programa"}
      </button>
    </form>
  )
}
