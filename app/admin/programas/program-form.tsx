"use client"

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { saveProgram } from "@/lib/actions/programs"

interface ProgramFormProps {
  program?: any
  instructors: { id: string; name: string }[]
}

export function ProgramForm({ program, instructors }: ProgramFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, watch } = useForm({
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

  const isStandalone = watch("is_standalone_class")

  const onSave = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const result = await saveProgram(data, program?.id)
      if (result.error) {
        setError(result.error)
      } else {
        router.push("/admin/programas")
        router.refresh()
      }
    } catch (e) {
      setError("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-6 bg-white p-8 rounded-xl border shadow-sm">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Título</label>
          <input {...register("title")} className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-black" placeholder="Ej: Yoga para el despertar" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Slug (URL)</label>
          <input {...register("slug")} className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-black" placeholder="ej-yoga-despertar" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Experiencia</label>
          <select {...register("experience_type")} className="border p-2 rounded-md bg-white">
            <option value="Yoga">Yoga</option>
            <option value="Meditacion">Meditación</option>
            <option value="Fitness">Fitness</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Categoría</label>
          <input {...register("category")} className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-black" placeholder="Ej: Power Yoga" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Dificultad</label>
          <select {...register("difficulty")} className="border p-2 rounded-md bg-white">
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">URL de Vimeo (Principal)</label>
          <input {...register("vimeo_url")} className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-black" placeholder="https://vimeo.com/..." />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Área de Enfoque</label>
          <input {...register("focus_area")} className="border p-2 rounded-md outline-none focus:ring-2 focus:ring-black" placeholder="Ej: Flexibilidad" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Instructor</label>
          <select {...register("instructor_id")} className="border p-2 rounded-md bg-white">
            <option value="">Seleccionar instructor...</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>{ins.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("is_standalone_class")} id="standalone" className="w-4 h-4" />
          <label htmlFor="standalone" className="text-sm font-medium">¿Es una clase individual?</label>
        </div>
        {!isStandalone && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Total de clases</label>
            <input type="number" {...register("total_classes")} className="border p-1 rounded-md w-24" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_published")} id="published" className="w-4 h-4" />
        <label htmlFor="published" className="text-sm font-medium">Publicar inmediatamente</label>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <button type="button" onClick={() => router.back()} className="text-gray-500 hover:text-black">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-black text-white px-8 py-2 rounded-md disabled:bg-gray-400">
          {loading ? "Guardando..." : program ? "Actualizar" : "Crear Programa Premium"}
        </button>
      </div>
    </form>
  )
}
