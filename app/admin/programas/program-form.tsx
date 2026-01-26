"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { saveProgram } from "@/lib/actions/programs"
import { Sparkles, Eye, EyeOff } from "lucide-react"

export function ProgramForm({ program, instructors }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: program || {
      experience_type: "Yoga",
      is_published: false,
      is_standalone_class: false
    }
  })

  const isPublished = watch("is_published")
  const currentTitle = watch("title")

  const generateSlug = () => {
    if (!currentTitle) return;
    const slug = currentTitle.toLowerCase().trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    setValue("slug", slug);
  }

  const onSave = async (data: any) => {
    setLoading(true)
    const result = await saveProgram(data, program?.id)
    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/admin/programas")
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-8 bg-white p-10 rounded-xl border max-w-5xl mx-auto font-sans">
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Título</label>
          <input {...register("title")} className="border p-3 rounded-lg outline-none focus:ring-1 focus:ring-black" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Slug (URL)</label>
          <div className="flex gap-2">
            <input {...register("slug")} className="border p-3 rounded-lg flex-1 outline-none focus:ring-1 focus:ring-black" />
            <button type="button" onClick={generateSlug} className="bg-zinc-100 p-3 rounded-lg hover:bg-zinc-200"><Sparkles size={18} /></button>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Descripción</label>
          <textarea {...register("description")} rows={3} className="border p-3 rounded-lg outline-none focus:ring-1 focus:ring-black resize-none" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Experiencia</label>
          <select {...register("experience_type")} className="border p-3 rounded-lg bg-white outline-none">
            <option value="Yoga">Yoga</option>
            <option value="Meditacion">Meditación</option>
            <option value="Fitness">Fitness</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Área de Enfoque</label>
          <input {...register("focus_area")} className="border p-3 rounded-lg outline-none focus:ring-1 focus:ring-black" placeholder="Ej: Calma mental" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">URL Vimeo</label>
          <input {...register("vimeo_url")} className="border p-3 rounded-lg outline-none focus:ring-1 focus:ring-black" />
        </div>

        {/* --- AQUÍ ESTÁ EL CAMPO NUEVO QUE AGREGAMOS --- */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Foto de Portada (Full Width)</label>
          <input 
            {...register("cover_image_url")} 
            className="border p-3 rounded-lg outline-none focus:ring-1 focus:ring-black" 
            placeholder="Pega el link de la imagen aquí"
          />
        </div>
        {/* ------------------------------------------- */}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-zinc-700 uppercase tracking-widest">Instructor</label>
          <select {...register("instructor_id")} className="border p-3 rounded-lg bg-white outline-none">
            <option value="">Seleccionar...</option>
            {instructors.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
      </div>

      <div className="p-6 bg-zinc-50 rounded-xl border flex items-center justify-between transition-colors">
        <div className="flex items-center gap-4">
          {isPublished ? <Eye className="text-green-600" /> : <EyeOff className="text-zinc-400" />}
          <div>
            <p className="font-bold text-zinc-900">{isPublished ? "Publicado" : "Borrador"}</p>
            <p className="text-xs text-zinc-500">¿Visible
