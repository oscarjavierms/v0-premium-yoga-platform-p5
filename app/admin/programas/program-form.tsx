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

  const isStandalone = watch("is_standalone_class")
  const isPublished = watch("is_published")
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
    <form onSubmit={handleSubmit(onSave)} className="space-y-8 bg-white p-8 rounded-xl border shadow-sm max-w-5xl mx-auto">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Título */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Título del Programa</label>
          <input {...register("title")} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black transition-all" placeholder="Ej: Yoga para el despertar" />
        </div>

        {/* Slug */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Slug (URL)</label>
          <div className="flex gap-2">
            <input {...register("slug")} className="border p-3 rounded-lg flex-1 outline-none focus:ring-2 focus:ring-black transition-all" placeholder="ej-yoga-despertar" />
            <button type="button" onClick={generateSlug} className="bg-zinc-100 px-4 rounded-lg hover:bg-zinc-200 transition-colors flex items-center gap-2 text-sm font-medium border">
              <Sparkles size={16} /> Generar
            </button>
          </div>
        </div>

        {/* Descripción (Ancho completo) */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700">Descripción del Programa</label>
          <textarea {...register("description")} rows={4} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black transition-all resize-none" placeholder="Describe brevemente de qué trata este programa..." />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Experiencia</label>
          <select {...register("experience_type")} className="border p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black">
            <option value="Yoga">Yoga</option>
            <option value="Meditacion">Meditación</option>
            <option value="Fitness">Fitness</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Categoría</label>
          <input {...register("category")} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black transition-all" placeholder="Ej: Vinyasa Flow" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">URL de Vimeo (Principal)</label>
          <input {...register("vimeo_url")} className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-black transition-all" placeholder="https://vimeo.com/..." />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-gray-700">Instructor</label>
          <select {...register("instructor_id")} className="border p-3 rounded-lg bg-white outline-none focus:ring-2 focus:ring-black">
            <option value="">Seleccionar instructor...</option>
            {instructors.map((ins) => (
              <option key={ins.id} value={ins.id}>{ins.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-6 bg-zinc-50 p-6 rounded-xl border border-zinc-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input type="checkbox" {...register("is_standalone_class")} id="standalone" className="w-5 h-5 accent-black" />
            <label htmlFor="standalone" className="font-semibold text-gray-800">¿Es una clase individual suelta?</label>
          </div>
          {!isStandalone && (
            <div className="flex items-center gap-3">
              <label className="text-sm font-bold text-gray-700">Total de clases:</label>
              <input type="number" {...register("total_classes")} className="border p-2 rounded-lg w-20 outline-none focus:ring-2 focus:ring-black" />
            </div>
          )}
        </div>

        <hr className="border-zinc-200" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isPublished ? <Eye className="text-green-600" /> : <EyeOff className="text-amber-600" />}
            <div>
              <p className="font-bold text-gray-900">{isPublished ? "Público" : "Borrador"}</p>
              <p className="text-xs text-gray-500">
                {isPublished ? "Visible para los alumnos en la web." : "Solo visible para administradores."}
              </p>
            </div>
          </div>
          <input type="checkbox" {...register("is_published")} className="w-6 h-6 accent-black cursor-pointer" />
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button type="button" onClick={() => router.back()} className="px-6 py-3 font-medium text-gray-500 hover:text-black transition-colors">Cancelar</button>
        <button type="submit" disabled={loading} className="bg-black text-white px-10 py-3 rounded-xl font-bold hover:bg-zinc-800 disabled:bg-gray-400 transition-all shadow-lg shadow-zinc-200">
          {loading ? "Guardando..." : program ? "Actualizar Programa" : "Crear Programa Premium"}
        </button>
      </div>
    </form>
  )
}
