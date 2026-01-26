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

  const { register, handleSubmit } = useForm({
    defaultValues: program || {
      title: "",
      slug: "",
      description: "",
      experience_type: "Yoga",
      difficulty: "beginner",
      focus_area: "",
      total_classes: 0,
      is_published: false,
    },
  })

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
    <form onSubmit={handleSubmit(onSave)} className="space-y-6 bg-white p-6 rounded-lg border">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Título */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Título del Programa</label>
          <input
            {...register("title")}
            className="border p-2 rounded-md focus:ring-2 focus:ring-black outline-none"
            placeholder="Ej: Yoga para el despertar"
          />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Slug (URL)</label>
          <input
            {...register("slug")}
            className="border p-2 rounded-md focus:ring-2 focus:ring-black outline-none"
            placeholder="ej-yoga-despertar"
          />
        </div>

        {/* Experiencia (Pillar) */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Experiencia</label>
          <select 
            {...register("experience_type")} 
            className="border p-2 rounded-md bg-white cursor-pointer"
          >
            <option value="Yoga">Yoga</option>
            <option value="Meditacion">Meditación</option>
            <option value="Fitness">Fitness</option>
          </select>
        </div>

        {/* Dificultad */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Dificultad</label>
          <select 
            {...register("difficulty")} 
            className="border p-2 rounded-md bg-white cursor-pointer"
          >
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>

        {/* Área de Enfoque */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Área de Enfoque</label>
          <input
            {...register("focus_area")}
            className="border p-2 rounded-md focus:ring-2 focus:ring-black outline-none"
            placeholder="Ej: Flexibilidad o Fuerza"
          />
        </div>

        {/* Instructor */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Instructor</label>
          <select 
            {...register("instructor_id")} 
            className="border p-2 rounded-md bg-white cursor-pointer"
          >
            <option value="">Seleccionar instructor...</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>{ins.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input type="checkbox" {...register("is_published")} id="published" className="w-4 h-4" />
        <label htmlFor="published" className="text-sm font-medium">Publicar programa inmediatamente</label>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition-colors shadow-sm"
        >
          {loading ? "Guardando..." : program ? "Actualizar Programa" : "Crear Programa"}
        </button>
      </div>
    </form>
  )
}
