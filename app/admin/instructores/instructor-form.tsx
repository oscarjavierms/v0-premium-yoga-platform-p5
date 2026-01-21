"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { toast } from "sonner"
import { createInstructor, updateInstructor } from "@/lib/actions/instructors"
import { X, Plus } from "lucide-react"

const InstructorSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  bio: z.string().optional(),
  avatar_url: z.string().url("URL inválida").optional().or(z.literal("")),
  instagram_url: z.string().url("URL inválida").optional().or(z.literal("")),
})

type InstructorFormValues = z.infer<typeof InstructorSchema>

interface Instructor {
  id: string
  name: string
  slug: string
  bio: string | null
  specialty: string[] | null
  avatar_url: string | null
  instagram_url: string | null
}

interface InstructorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructor?: Instructor | null
  onSuccess?: () => void
}

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: InstructorFormProps) {
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>(instructor?.specialty || [])
  const [newSpecialty, setNewSpecialty] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<InstructorFormValues>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: {
      name: instructor?.name || "",
      slug: instructor?.slug || "",
      bio: instructor?.bio || "",
      avatar_url: instructor?.avatar_url || "",
      instagram_url: instructor?.instagram_url || "",
    },
  })

  const nameValue = watch("name")

  const generateSlug = () => {
    const slug = nameValue
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    setValue("slug", slug)
  }

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()])
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: InstructorFormValues) => {
    setLoading(true)
    try {
      const formData = { ...data, specialty: specialties }

      const result = instructor ? await updateInstructor(instructor.id, formData) : await createInstructor(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(instructor ? "Instructor actualizado" : "Instructor creado")
        reset()
        setSpecialties([])
        onOpenChange(false)
        onSuccess?.()
      }
    } catch {
      toast.error("Error al guardar el instructor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{instructor ? "Editar Instructor" : "Nuevo Instructor"}</SheetTitle>
          <SheetDescription>
            {instructor ? "Modifica los datos del instructor" : "Completa los datos del nuevo instructor"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" {...register("name")} placeholder="Nombre completo" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <div className="flex gap-2">
              <Input id="slug" {...register("slug")} placeholder="nombre-instructor" />
              <Button type="button" variant="outline" onClick={generateSlug} className="shrink-0 bg-transparent">
                Generar
              </Button>
            </div>
            {errors.slug && <p className="text-sm text-red-500">{errors.slug.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea id="bio" {...register("bio")} placeholder="Descripción del instructor..." rows={4} />
          </div>

          <div className="space-y-2">
            <Label>Especialidades</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Añadir especialidad"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSpecialty()
                  }
                }}
              />
              <Button type="button" variant="outline" size="icon" onClick={addSpecialty}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {specialties.map((specialty, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm">
                    {specialty}
                    <button type="button" onClick={() => removeSpecialty(index)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar_url">URL de Foto</Label>
            <Input id="avatar_url" {...register("avatar_url")} placeholder="https://..." />
            {errors.avatar_url && <p className="text-sm text-red-500">{errors.avatar_url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram_url">Instagram URL</Label>
            <Input id="instagram_url" {...register("instagram_url")} placeholder="https://instagram.com/..." />
            {errors.instagram_url && <p className="text-sm text-red-500">{errors.instagram_url.message}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Guardando..." : instructor ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
