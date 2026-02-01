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
import { X, Plus, Image as ImageIcon, User } from "lucide-react"

const InstructorSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  bio: z.string().optional(),
  avatar_url: z.string().optional().or(z.literal("")),
  cover_url: z.string().optional().or(z.literal("")),
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
  cover_url: string | null
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
  
  // Estados para las imágenes
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [coverUrl, setCoverUrl] = useState<string | null>(null)

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
      cover_url: "",
      instagram_url: "",
    },
  })

  const nameValue = watch("name")

  useEffect(() => {
    if (instructor) {
      setValue("name", instructor.name)
      setValue("slug", instructor.slug)
      setValue("bio", instructor.bio || "")
      setValue("avatar_url", instructor.avatar_url || "")
      setValue("cover_url", instructor.cover_url || "")
      setValue("instagram_url", instructor.instagram_url || "")
      setSpecialties(instructor.specialty || [])
      setAvatarUrl(instructor.avatar_url || null)
      setCoverUrl(instructor.cover_url || null)
    } else {
      reset()
      setSpecialties([])
      setAvatarUrl(null)
      setCoverUrl(null)
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
      const formData = { 
        ...data, 
        specialty: specialties,
        avatar_url: avatarUrl || data.avatar_url || "",
        cover_url: coverUrl || data.cover_url || ""
      }

      const result = instructor 
        ? await updateInstructor(instructor.id, formData) 
        : await createInstructor(formData)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(instructor ? "Instructor actualizado" : "Instructor creado")
        reset()
        onOpenChange(false)
        onSuccess?.()
      }
    } catch (error) {
      toast.error("Error al guardar el instructor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{instructor ? "Editar Instructor" : "Nuevo Instructor"}</SheetTitle>
          <SheetDescription>Configura el perfil premium del instructor.</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-8">
          
          {/* SECCIÓN DE IMÁGENES (Solo en edición) */}
          {instructor && (
            <div className="grid grid-cols-2 gap-4 border-b pb-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase flex items-center gap-2">
                  <User className="w-3 h-3" /> Foto Perfil
                </Label>
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentAvatarUrl={instructor.avatar_url}
                  onAvatarChange={(url) => {
                    setAvatarUrl(url)
                    setValue("avatar_url", url)
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Foto Portada
                </Label>
                <InstructorAvatarUpload
                  instructorId={`${instructor.id}-cover`} // ID diferente para la carpeta
                  currentAvatarUrl={instructor.cover_url}
                  onAvatarChange={(url) => {
                    setCoverUrl(url)
                    setValue("cover_url", url)
                  }}
                />
              </div>
            </div>
          )}

          {/* Nombre y Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" {...register("name")} placeholder="Ej: Julian Yoga" />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input id="slug" {...register("slug")} />
                <Button type="button" variant="outline" onClick={generateSlug} className="shrink-0">
                  Auto
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Biografía Premium</Label>
            <Textarea id="bio" {...register("bio")} placeholder="Describe la trayectoria..." rows={5} />
          </div>

          {/* Especialidades */}
          <div className="space-y-3">
            <Label>Especialidades</Label>
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Añadir tag..."
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" variant="secondary" onClick={addSpecialty}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {specialties.map((s, i) => (
                <span key={i} className="px-3 py-1 bg-zinc-100 text-xs font-medium rounded-full flex items-center gap-2">
                  {s} <X className="w-3 h-3 cursor-pointer" onClick={() => removeSpecialty(i)} />
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram_url">Instagram</Label>
            <Input id="instagram_url" {...register("instagram_url")} placeholder="https://..." />
          </div>

          <div className="flex gap-3 sticky bottom-0 bg-white pt-4 pb-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 bg-black text-white">
              {loading ? "Guardando..." : instructor ? "Actualizar Perfil" : "Crear Instructor"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
