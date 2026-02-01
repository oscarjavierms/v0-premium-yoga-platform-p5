"use client"

import { useState, useEffect } from "react"
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
import { InstructorAvatarUpload } from "@/components/admin/instructor-avatar-upload"
import { X, Plus } from "lucide-react"

const InstructorSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  bio: z.string().optional(),
  avatar_url: z.string().optional().or(z.literal("")),
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
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [instructorId] = useState(() => instructor?.id || "")

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
      name: "",
      slug: "",
      bio: "",
      avatar_url: "",
      instagram_url: "",
    },
  })

  const nameValue = watch("name")

  // ✅ CARGAR DATOS AL ABRIR/EDITAR
  useEffect(() => {
    if (instructor) {
      setValue("name", instructor.name)
      setValue("slug", instructor.slug)
      setValue("bio", instructor.bio || "")
      setValue("avatar_url", instructor.avatar_url || "")
      setValue("instagram_url", instructor.instagram_url || "")
      setSpecialties(instructor.specialty || [])
      setAvatarUrl(instructor.avatar_url || null)
    } else {
      reset()
      setSpecialties([])
      setAvatarUrl(null)
    }
  }, [instructor, setValue, reset])

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
      // ✅ Usar avatarUrl guardado del upload
      const formData = { 
        ...data, 
        specialty: specialties,
        avatar_url: avatarUrl || data.avatar_url || ""
      }

      const result = instructor 
        ? await updateInstructor(instructor.id, formData) 
        : await createInstructor(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(instructor ? "Instructor actualizado" : "Instructor creado")
        reset()
        setSpecialties([])
        setAvatarUrl(null)
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      toast.error("Error al guardar el instructor")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // ✅ SOLO mostrar upload si es EDICIÓN (instructor existe)
  // Para nuevos instructores, la foto se sube DESPUÉS de crear
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
          
          {/* Upload de Foto - SOLO para edición */}
          {instructor && (
            <InstructorAvatarUpload
              instructorId={instructor.id}
              currentAvatarUrl={instructor.avatar_url}
              onAvatarChange={(url) => {
                setAvatarUrl(url)
                setValue("avatar_url", url)
              }}
            />
          )}

          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" {...register("name")} placeholder="Nombre completo" />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          {/* Slug */}
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

          {/* Biografía */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biografía</Label>
            <Textarea id="bio" {...register("bio")} placeholder="Descripción del instructor..." rows={4} />
          </div>

          {/* Especialidades */}
          <div className="space-y-2">
            <Label>Especialidades</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Ej: Yoga, Meditación, Fitness"
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

          {/* Instagram */}
          <div className="space-y-2">
            <Label htmlFor="instagram_url">Instagram URL</Label>
            <Input id="instagram_url" {...register("instagram_url")} placeholder="https://instagram.com/..." />
            {errors.instagram_url && <p className="text-sm text-red-500">{errors.instagram_url.message}</p>}
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Guardando..." : instructor ? "Actualizar" : "Crear"}
            </Button>
          </div>

          {/* Info para nuevos instructores */}
          {!instructor && (
            <p className="text-xs text-muted-foreground bg-blue-50 p-3 rounded">
              💡 Después de crear el instructor, podrás agregar una foto desde la lista de instructores.
            </p>
          )}
        </form>
      </SheetContent>
    </Sheet>
  )
}
