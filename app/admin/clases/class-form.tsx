"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { toast } from "sonner"
import { createClass, updateClass } from "@/lib/actions/classes"
import { PILLAR_LABELS, LEVEL_LABELS } from "@/types/content"
import { Play, AlertCircle, CheckCircle } from "lucide-react"

const ClassSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  thumbnail_url: z.string().url("URL inválida").optional().or(z.literal("")),
  vimeo_id: z.string().optional(),
  duration_minutes: z.coerce.number().min(1).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  pillar: z.enum(["movement", "mindfulness", "nutrition", "sleep", "stress", "connection"]),
  instructor_id: z.string().optional(),
  program_id: z.string().optional(),
  program_order: z.coerce.number().optional(),
  is_free: z.boolean(),
  is_published: z.boolean(),
})

type ClassFormValues = z.infer<typeof ClassSchema>

interface ClassItem {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  vimeo_id: string | null
  duration_minutes: number | null
  difficulty: string
  pillar: string
  instructor_id: string | null
  program_id: string | null
  program_order: number | null
  is_free: boolean
  is_published: boolean
}

interface Instructor {
  id: string
  name: string
}

interface Program {
  id: string
  title: string
}

interface ClassFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  classItem?: ClassItem | null
  instructors: Instructor[]
  programs: Program[]
  onSuccess?: () => void
}

// Helper to extract Vimeo ID from URL or ID string
function extractVimeoId(input: string): string | null {
  if (!input) return null

  // If it's already just a number (ID)
  if (/^\d+$/.test(input.trim())) {
    return input.trim()
  }

  // Try to extract from various Vimeo URL formats
  const patterns = [
    /vimeo\.com\/(\d+)/,
    /player\.vimeo\.com\/video\/(\d+)/,
    /vimeo\.com\/channels\/[\w]+\/(\d+)/,
    /vimeo\.com\/groups\/[\w]+\/videos\/(\d+)/,
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

export function ClassForm({ open, onOpenChange, classItem, instructors, programs, onSuccess }: ClassFormProps) {
  const [loading, setLoading] = useState(false)
  const [vimeoInput, setVimeoInput] = useState(classItem?.vimeo_id || "")
  const [vimeoValidated, setVimeoValidated] = useState<boolean | null>(classItem?.vimeo_id ? true : null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ClassFormValues>({
    resolver: zodResolver(ClassSchema),
    defaultValues: {
      title: classItem?.title || "",
      slug: classItem?.slug || "",
      description: classItem?.description || "",
      thumbnail_url: classItem?.thumbnail_url || "",
      vimeo_id: classItem?.vimeo_id || "",
      duration_minutes: classItem?.duration_minutes || undefined,
      difficulty: (classItem?.difficulty as any) || "beginner",
      pillar: (classItem?.pillar as any) || "movement",
      instructor_id: classItem?.instructor_id || undefined,
      program_id: classItem?.program_id || undefined,
      program_order: classItem?.program_order || undefined,
      is_free: classItem?.is_free || false,
      is_published: classItem?.is_published || false,
    },
  })

  const titleValue = watch("title")

  const generateSlug = () => {
    const slug = titleValue
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setValue("slug", slug)
  }

  const validateVimeo = () => {
    const id = extractVimeoId(vimeoInput)
    if (id) {
      setValue("vimeo_id", id)
      setVimeoValidated(true)
      toast.success(`Video ID válido: ${id}`)
    } else {
      setVimeoValidated(false)
      toast.error("No se pudo extraer un ID de Vimeo válido")
    }
  }

  const onSubmit = async (data: ClassFormValues) => {
    setLoading(true)
    try {
      const formData = {
        ...data,
        instructor_id: data.instructor_id || null,
        program_id: data.program_id || null,
      }

      const result = classItem ? await updateClass(classItem.id, formData) : await createClass(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(classItem ? "Clase actualizada" : "Clase creada")
        reset()
        setVimeoInput("")
        setVimeoValidated(null)
        onOpenChange(false)
        onSuccess?.()
      }
    } catch {
      toast.error("Error al guardar la clase")
    } finally {
      setLoading(false)
    }
  }

  const vimeoId = watch("vimeo_id")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{classItem ? "Editar Clase" : "Nueva Clase"}</SheetTitle>
          <SheetDescription>
            {classItem ? "Modifica los datos de la clase" : "Completa los datos de la nueva clase"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" {...register("title")} placeholder="Nombre de la clase" />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input id="slug" {...register("slug")} placeholder="nombre-clase" />
              <Button type="button" variant="outline" onClick={generateSlug} className="shrink-0 bg-transparent">
                Generar
              </Button>
            </div>
            {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" {...register("description")} placeholder="Descripción de la clase..." rows={3} />
          </div>

          {/* Vimeo Section */}
          <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 font-medium">
              <Play className="w-4 h-4" />
              Video (Vimeo)
            </div>

            <div className="space-y-2">
              <Label htmlFor="vimeo_input">URL o ID de Vimeo</Label>
              <div className="flex gap-2">
                <Input
                  id="vimeo_input"
                  value={vimeoInput}
                  onChange={(e) => {
                    setVimeoInput(e.target.value)
                    setVimeoValidated(null)
                  }}
                  placeholder="https://vimeo.com/123456789 o 123456789"
                />
                <Button type="button" variant="outline" onClick={validateVimeo} className="shrink-0 bg-transparent">
                  Validar
                </Button>
              </div>

              {vimeoValidated === true && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  Video ID: {vimeoId}
                </div>
              )}
              {vimeoValidated === false && (
                <div className="flex items-center gap-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  URL o ID inválido
                </div>
              )}
            </div>

            {vimeoId && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://player.vimeo.com/video/${vimeoId}`}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                defaultValue={classItem?.pillar || "movement"}
                onValueChange={(value) => setValue("pillar", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PILLAR_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Nivel *</Label>
              <Select
                defaultValue={classItem?.difficulty || "beginner"}
                onValueChange={(value) => setValue("difficulty", value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEVEL_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Instructor</Label>
              <Select
                defaultValue={classItem?.instructor_id || ""}
                onValueChange={(value) => setValue("instructor_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {instructors.map((instructor) => (
                    <SelectItem key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Programa</Label>
              <Select
                defaultValue={classItem?.program_id || ""}
                onValueChange={(value) => setValue("program_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {programs.map((program) => (
                    <SelectItem key={program.id} value={program.id}>
                      {program.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duración (min)</Label>
              <Input id="duration_minutes" type="number" {...register("duration_minutes")} placeholder="30" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="program_order">Orden en programa</Label>
              <Input id="program_order" type="number" {...register("program_order")} placeholder="1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">URL Thumbnail</Label>
              <Input id="thumbnail_url" {...register("thumbnail_url")} placeholder="https://..." />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="is_free">Gratuita</Label>
              <p className="text-sm text-muted-foreground">Disponible sin suscripción</p>
            </div>
            <Switch
              id="is_free"
              checked={watch("is_free")}
              onCheckedChange={(checked) => setValue("is_free", checked)}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="is_published">Publicada</Label>
              <p className="text-sm text-muted-foreground">Visible para los usuarios</p>
            </div>
            <Switch
              id="is_published"
              checked={watch("is_published")}
              onCheckedChange={(checked) => setValue("is_published", checked)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Guardando..." : classItem ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
