"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { toast } from "sonner"
import { X, Plus } from "lucide-react"
import { createInstructor, updateInstructor } from "@/lib/actions/instructors"
import { InstructorAvatarUpload } from "@/components/admin/instructor-avatar-upload"

const InstructorSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  slug: z.string().min(2, "Slug requerido"),
  bio: z.string().optional(),
  avatar_url: z.string().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  instagram_url: z.string().url("URL de Instagram inválida").nullable().optional(),
})

type InstructorFormData = z.infer<typeof InstructorSchema>

interface InstructorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructor?: any
  onSuccess?: () => void
}

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: InstructorFormProps) {
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<InstructorFormData>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: { 
      name: "",
      slug: "",
      bio: "",
      avatar_url: null,
      cover_url: null,
      instagram_url: "",
    }
  })

  // Observar cambios de imágenes
  const valCover = watch("cover_url")
  const valAvatar = watch("avatar_url")

  // Cargar datos cuando el modal abre o cambia el instructor
  useEffect(() => {
    if (open) {
      if (instructor) {
        // Si es edición, cargar datos existentes
        reset({
          name: instructor.name || "",
          slug: instructor.slug || "",
          bio: instructor.bio || "",
          avatar_url: instructor.avatar_url || null,
          cover_url: instructor.cover_url || null,
          instagram_url: instructor.instagram_url || "",
        })
        setSpecialties(instructor.specialty || [])
      } else {
        // Si es creación, limpiar formulario
        reset({
          name: "",
          slug: "",
          bio: "",
          avatar_url: null,
          cover_url: null,
          instagram_url: "",
        })
        setSpecialties([])
      }
      setNewSpecialty("")
    }
  }, [instructor, open, reset])

  const onSubmit = async (data: InstructorFormData) => {
    setLoading(true)
    try {
      // Validaciones adicionales
      if (!data.name.trim()) {
        throw new Error("El nombre es requerido")
      }
      if (!data.slug.trim()) {
        throw new Error("El slug es requerido")
      }

      // Preparar datos con especialidades
      const submitData = {
        ...data,
        specialty: specialties,
      }

      // Llamar a la acción (crear o actualizar)
      const result = instructor 
        ? await updateInstructor(instructor.id, submitData) 
        : await createInstructor(submitData)

      if (result.error) {
        throw new Error(result.error)
      }

      toast.success(
        instructor ? "Instructor actualizado exitosamente" : "Instructor creado exitosamente"
      )
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error: any) {
      console.error("Error en onSubmit:", error)
      toast.error(error.message || "Error al guardar instructor")
    } finally {
      setLoading(false)
    }
  }

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setSpecialties([...specialties, newSpecialty.trim()])
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, idx) => idx !== index))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {instructor ? "Editar Instructor" : "Crear Instructor"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 pb-10">
          
          {/* SECCIÓN DE IMÁGENES - Solo si está editando */}
          {instructor && (
            <div className="space-y-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
              {/* CAMPO PORTADA */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-zinc-500">
                  Imagen de Portada (21:9)
                </Label>
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentImageUrl={valCover}
                  onImageChange={(url) => {
                    if (url) {
                      setValue("cover_url", url, { shouldDirty: true, shouldValidate: true })
                      toast.success("Portada actualizada")
                    }
                  }}
                  variant="cover"
                />
              </div>

              {/* CAMPO PERFIL */}
              <div className="flex items-center gap-6">
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentImageUrl={valAvatar}
                  onImageChange={(url) => {
                    if (url) {
                      setValue("avatar_url", url, { shouldDirty: true, shouldValidate: true })
                      toast.success("Foto de perfil actualizada")
                    }
                  }}
                  variant="circle"
                />
                <div className="space-y-1">
                  <p className="text-sm font-bold">Foto de perfil</p>
                  <p className="text-xs text-zinc-500">Esta foto se verá en el buscador.</p>
                </div>
              </div>
            </div>
          )}

          {/* FORMULARIO */}
          <div className="grid gap-4">
            {/* Nombre */}
            <div className="grid gap-2">
              <Label>Nombre *</Label>
              <Input 
                {...register("name")} 
                placeholder="Ej: Laura Díaz"
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            {/* Slug */}
            <div className="grid gap-2">
              <Label>Slug *</Label>
              <Input 
                {...register("slug")} 
                placeholder="Ej: laura-diaz"
              />
              {errors.slug && <p className="text-xs text-red-500">{errors.slug.message}</p>}
            </div>

            {/* Instagram URL */}
            <div className="grid gap-2">
              <Label>URL Instagram</Label>
              <Input 
                {...register("instagram_url")} 
                placeholder="https://instagram.com/..."
              />
              {errors.instagram_url && <p className="text-xs text-red-500">{errors.instagram_url.message}</p>}
            </div>

            {/* Biografía */}
            <div className="grid gap-2">
              <Label>Biografía</Label>
              <Textarea 
                {...register("bio")} 
                rows={4}
                placeholder="Cuéntale a los estudiantes sobre tu experiencia..."
              />
            </div>

            {/* Especialidades */}
            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="flex gap-2">
                <Input 
                  value={newSpecialty} 
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSpecialty()
                    }
                  }}
                  placeholder="Ej: Hatha Yoga"
                />
                <Button 
                  type="button" 
                  onClick={addSpecialty}
                  className="bg-black hover:bg-zinc-800"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Especialidades añadidas */}
              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-medium flex items-center gap-2"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => removeSpecialty(index)}
                        className="hover:opacity-70 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón Submit */}
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white h-12 rounded-xl hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Guardando...
              </>
            ) : (
              instructor ? "Actualizar Instructor" : "Crear Instructor"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
