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
import { createProgram, updateProgram } from "@/lib/actions/programs"
import { PILLAR_LABELS, LEVEL_LABELS } from "@/types/content"

const ProgramSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  thumbnail_url: z.string().url("URL inválida").optional().or(z.literal("")),
  duration_weeks: z.coerce.number().min(1).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  pillar: z.enum(["movement", "mindfulness", "nutrition", "sleep", "stress", "connection"]),
  instructor_id: z.string().optional(),
  is_featured: z.boolean(),
  is_published: z.boolean(),
})

type ProgramFormValues = z.infer<typeof ProgramSchema>

interface Program {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  duration_weeks: number | null
  difficulty: string
  pillar: string
  instructor_id: string | null
  is_featured: boolean
  is_published: boolean
}

interface Instructor {
  id: string
  name: string
}

interface ProgramFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program?: Program | null
  instructors: Instructor[]
  onSuccess?: () => void
}

export function ProgramForm({ open, onOpenChange, program, instructors, onSuccess }: ProgramFormProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProgramFormValues>({
    resolver: zodResolver(ProgramSchema),
    defaultValues: {
      title: program?.title || "",
      slug: program?.slug || "",
      description: program?.description || "",
      thumbnail_url: program?.thumbnail_url || "",
      duration_weeks: program?.duration_weeks || undefined,
      difficulty: (program?.difficulty as any) || "beginner",
      pillar: (program?.pillar as any) || "movement",
      instructor_id: program?.instructor_id || undefined,
      is_featured: program?.is_featured || false,
      is_published: program?.is_published || false,
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

  const onSubmit = async (data: ProgramFormValues) => {
    setLoading(true)
    try {
      const formData = {
        ...data,
        instructor_id: data.instructor_id || null,
      }

      const result = program ? await updateProgram(program.id, formData) : await createProgram(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(program ? "Programa actualizado" : "Programa creado")
        reset()
        onOpenChange(false)
        onSuccess?.()
      }
    } catch {
      toast.error("Error al guardar el programa")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{program ? "Editar Programa" : "Nuevo Programa"}</SheetTitle>
          <SheetDescription>
            {program ? "Modifica los datos del programa" : "Completa los datos del nuevo programa"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input id="title" {...register("title")} placeholder="Nombre del programa" />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input id="slug" {...register("slug")} placeholder="nombre-programa" />
              <Button type="button" variant="outline" onClick={generateSlug} className="shrink-0 bg-transparent">
                Generar
              </Button>
            </div>
            {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descripción del programa..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría *</Label>
              <Select
                defaultValue={program?.pillar || "movement"}
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
                defaultValue={program?.difficulty || "beginner"}
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

          <div className="space-y-2">
            <Label>Instructor</Label>
            <Select
              defaultValue={program?.instructor_id || ""}
              onValueChange={(value) => setValue("instructor_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar instructor" />
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration_weeks">Duración (semanas)</Label>
              <Input id="duration_weeks" type="number" {...register("duration_weeks")} placeholder="4" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">URL Thumbnail</Label>
              <Input id="thumbnail_url" {...register("thumbnail_url")} placeholder="https://..." />
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="is_featured">Destacado</Label>
              <p className="text-sm text-muted-foreground">Mostrar en la página principal</p>
            </div>
            <Switch
              id="is_featured"
              checked={watch("is_featured")}
              onCheckedChange={(checked) => setValue("is_featured", checked)}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <Label htmlFor="is_published">Publicado</Label>
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
              {loading ? "Guardando..." : program ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
