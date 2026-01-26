"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { saveProgram } from "@/lib/actions/programs"
import { Sparkles, Eye, EyeOff } from "lucide-react"

interface ProgramFormProps {
  program?: any
  instructors: { id: string; name: string }[]
}

export function ProgramForm({ program, instructors }: ProgramFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: program || {
      title: "",
      slug: "",
      description: "",
      experience_type: "Yoga",
      difficulty: "beginner",
      focus_area: "",
      total_classes: 0,
      vimeo_url: "",
      category: "",
      is_standalone_class: false,
      is_published: false,
    },
  })

  const isPublished = watch("is_published")
  const isStandalone = watch("is_standalone_class")
  const currentTitle = watch("title")

  const generateSlug = () => {
    if (!currentTitle) return;
    const slug = currentTitle
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setValue("slug", slug);
  }

  const onSave = async (data: any) => {
    setLoading(true)
    setError(null)
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
    <form onSubmit={handleSubmit(onSave)} className="space-y-8 bg-white p-10 rounded-xl border shadow-sm max-w-5xl mx-auto font-sans">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm font-medium">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Título del Programa</label>
          <input {...register("title")} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="Ej: Yoga Flow Restaurativo" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Slug (URL)</label>
          <div className="flex gap-2">
            <input {...register("slug")} className="border p-3 rounded-lg flex-1 outline-none focus:ring-2 focus:ring-black" placeholder="ej-yoga-flow" />
            <button type="button" onClick={generateSlug} className="bg-zinc-100 p-3 rounded-lg hover:bg-zinc-200 transition-colors">
              <Sparkles size={18} />
            </button>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Descripción Completa</label>
          <textarea {...register("description")} rows={4} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black resize-none" placeholder="Escribe aquí los detalles del programa..." />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Experiencia</label>
          <select {...register("experience_type")} className="border p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black">
            <option value="Yoga">Yoga</option>
            <option value="Meditacion">Meditación</option>
            <option value="Fitness">Fitness</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Categoría</label>
          <input {...register("category")} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="Ej: Vinyasa" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Área de Enfoque</label>
          <input {...register("focus_area")} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="Ej: Fuerza, Flexibilidad, Calma" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Instructor</label>
          <select {...register("instructor_id")} className="border p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black">
            <option value="">Seleccionar instructor...</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>{ins.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">URL de Vimeo</label>
          <input {...register("vimeo_url")} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black" placeholder="https://vimeo.com/..." />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Dificultad</label>
          <select {...register("difficulty")} className="border p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black">
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
      </div>

      <div className="bg-zinc-50 p-6 rounded-xl border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="checkbox" {...register("is_standalone_class")} id="standalone" className="w-5 h-5 accent-black" />
            <label htmlFor="standalone" className="font-semibold text-gray-800">¿Es una clase individual suelta?</label>
          </div>
          {!isStandalone && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold">Total Clases:</label>
              <input type="number" {...register("total_classes")} className="border p-2 rounded w-20 outline-none focus:ring-2 focus:ring-black" />
            </div>
          )}
        </div>
        <hr />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPublished ? <Eye className="text-green-600" /> : <EyeOff className="text-amber-600" />}
            <div>
              <p className="font-bold text-zinc-900">{isPublished ? "Público" : "Borrador"}</p>
              <p className="text-xs text-zinc-500">Define si los alumnos pueden ver este programa.</p>
            </div>
          </div>
          <input type="checkbox" {...register("is_published")} className="w-6 h-6 accent-black" />
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-8">
        <button type="button" onClick={() => router.back()} className="text-zinc-500 font-medium">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-black text-white px-10 py-3 rounded-lg font-bold hover:opacity-80 disabled:bg-zinc-400">
          {loading ? "Guardando..." : program ? "Actualizar Programa" : "Crear Programa Premium"}
        </button>
      </div>
    </form>
  )
}
