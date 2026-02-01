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

// Validar schema con Zod
const InstructorSchema = z.object({
  name: z.string().min(2, "Nombre es requerido"),
  slug: z.string().min(2, "Slug es requerido"),
  bio: z.string().optional().default(""),
  avatar_url: z.string().nullable().optional().default(null),
  cover_url: z.string().nullable().optional().default(null),
  instagram_url: z.string().nullable().optional().default(null),
})

type InstructorFormData = z.infer<typeof InstructorSchema>

interface InstructorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructor?: any
  onSuccess?: () => void
}

export function InstructorForm({ 
  open, 
  onOpenChange, 
  instructor, 
  onSuccess 
}: InstructorFormProps) {
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")

  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    watch, 
    formState: { errors } 
  } = useForm<InstructorFormData>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: { 
      name: "",
      slug: "",
      bio: "",
      avatar_url: null,
      cover_url: null,
      instagram_url: null,
    }
  })

  // Observar cambios en las URLs de imágenes
  const watchCoverUrl = watch("cover_url")
  const watchAvatarUrl = watch("avatar_url")

  // Cargar datos cuando abre el modal
  useEffect(() => {
    if (open) {
      if (instructor) {
        // Modo edición
        console.log("📝 Editando instructor:", instructor.id)
        reset({
          name: instructor.name || "",
          slug: instructor.slug || "",
          bio: instructor.bio || "",
          avatar_url: instructor.avatar_url || null,
          cover_url: instructor.cover_url || null,
          instagram_url: instructor.instagram_url || null,
        })
        setSpecialties(instructor.specialty || [])
      } else {
        // Modo creación
        console.log("➕ Creando nuevo instructor")
        reset({
          name: "",
          slug: "",
          bio: "",
          avatar_url: null,
          cover_url: null,
          instagram_url: null,
        })
        setSpecialties([])
      }
      setNewSpecialty("")
    }
  }, [instructor, open, reset])

  // Manejar submit del formulario
  const onSubmit = async (data: InstructorFormData) => {
    setLoading(true)
    try {
      console.log("📤 Enviando datos:", { ...data, specialty: specialties })

      // Validaciones básicas
      if (!data.name.trim()) {
        throw new Error("El nombre del instructor es requerido")
      }
      if (!data.slug.trim()) {
        throw new Error("El slug es requerido")
      }

      // Preparar datos con especialidades
      const submitData = {
        ...data,
        specialty: specialties,
      }

      // Llamar a la acción correspondiente
      let result
      if (instructor) {
        console.log("🔄 Actualizando instructor:", instructor.id)
        result = await updateInstructor(instructor.id, submitData)
      } else {
        console.log("✨ Creando instructor nuevo")
        result = await createInstructor(submitData)
      }

      // Manejar resultado
      if (result.error) {
        throw new Error(result.error)
      }

      // Éxito
      const mensaje = instructor 
        ? "Instructor actualizado exitosamente ✅" 
        : "Instructor creado exitosamente ✅"
      
      console.log("✅ " + mensaje)
      toast.success(mensaje)
      
      // Cerrar modal y actualizar
      onOpenChange(false)
      onSuccess?.()
      
    } catch (error: any) {
      console.error("❌ Error en onSubmit:", error)
      const errorMsg = error.message || "Error al guardar el instructor"
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Agregar especialidad
  const handleAddSpecialty = () => {
    const trimmed = newSpecialty.trim()
    if (trimmed && !specialties.includes(trimmed)) {
      setSpecialties([...specialties, trimmed])
      setNewSpecialty("")
    }
  }

  // Remover especialidad
  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, idx) => idx !== index))
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {instructor ? "✏️ Editar Instructor" : "➕ Nuevo Instructor"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 pb-10">
          
          {/* SECCIÓN DE IMÁGENES - Solo si está editando */}
          {instructor && (
            <div className="space-y-6 bg-gradient-to-br from-zinc-50 to-zinc-100 p-6 rounded-2xl border border-zinc-200">
              <h3 className="text-sm font-semibold text-zinc-700">Multimedia</h3>
              
              {/* PORTADA */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-zinc-600">
                  📸 Imagen de Portada (Proporción 21:9)
                </Label>
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentImageUrl={watchCoverUrl}
                  onImageChange={(url) => {
                    console.log("🖼️ Cover actualizado:", url)
                    setValue("cover_url", url, { 
                      shouldDirty: true, 
                      shouldValidate: true 
                    })
                  }}
                  variant="cover"
                />
              </div>

              {/* AVATAR */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <InstructorAvatarUpload
                    instructorId={instructor.id}
                    currentImageUrl={watchAvatarUrl}
                    onImageChange={(url) => {
                      console.log("👤 Avatar actualizado:", url)
                      setValue("avatar_url", url, { 
                        shouldDirty: true, 
                        shouldValidate: true 
                      })
                    }}
                    variant="circle"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-zinc-700">Foto de Perfil</p>
                  <p className="text-xs text-zinc-500">
                    Esta foto aparecerá en el buscador de instructores.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* INFORMACIÓN BÁSICA */}
          <div className="grid gap-4">
            <h3 className="text-sm font-semibold text-zinc-700 mt-4">Información Básica</h3>

            {/* Nombre */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="font-medium">
                Nombre Completo *
              </Label>
              <Input 
                id="name"
                {...register("name")} 
                placeholder="Ej: Laura Díaz Martínez"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-xs text-red-500">⚠️ {errors.name.message}</p>
              )}
            </div>

            {/* Slug */}
            <div className="grid gap-2">
              <Label htmlFor="slug" className="font-medium">
                Slug *
              </Label>
              <Input 
                id="slug"
                {...register("slug")} 
                placeholder="Ej: laura-diaz-martinez"
                className={errors.slug ? "border-red-500" : ""}
              />
              {errors.slug && (
                <p className="text-xs text-red-500">⚠️ {errors.slug.message}</p>
              )}
              <p className="text-xs text-zinc-500">
                URL amigable para el perfil del instructor. Usa guiones, sin espacios.
              </p>
            </div>

            {/* Instagram */}
            <div className="grid gap-2">
              <Label htmlFor="instagram" className="font-medium">
                Instagram
              </Label>
              <Input 
                id="instagram"
                {...register("instagram_url")} 
                placeholder="https://instagram.com/tu_usuario"
                className={errors.instagram_url ? "border-red-500" : ""}
              />
              {errors.instagram_url && (
                <p className="text-xs text-red-500">⚠️ {errors.instagram_url.message}</p>
              )}
            </div>

            {/* Biografía */}
            <div className="grid gap-2">
              <Label htmlFor="bio" className="font-medium">
                Biografía
              </Label>
              <Textarea 
                id="bio"
                {...register("bio")} 
                rows={4}
                placeholder="Cuéntale a los estudiantes sobre tu experiencia, especialidades y enfoque..."
                className="resize-none"
              />
              <p className="text-xs text-zinc-500">
                {watch("bio")?.length || 0} caracteres
              </p>
            </div>

            {/* Especialidades */}
            <div className="space-y-3 pt-2">
              <Label htmlFor="specialty" className="font-medium">
                Especialidades
              </Label>
              <div className="flex gap-2">
                <Input 
                  id="specialty"
                  value={newSpecialty} 
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSpecialty()
                    }
                  }}
                  placeholder="Ej: Hatha Yoga, Meditación, Pranayama..."
                />
                <Button 
                  type="button" 
                  onClick={handleAddSpecialty}
                  className="bg-black hover:bg-zinc-800 text-white px-4"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Lista de especialidades */}
              {specialties.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                  {specialties.map((specialty, index) => (
                    <span 
                      key={index}
                      className="bg-black text-white px-3 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-2 hover:bg-zinc-800 transition"
                    >
                      {specialty}
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecialty(index)}
                        className="hover:opacity-70 transition ml-1"
                        title="Eliminar especialidad"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* BOTÓN SUBMIT */}
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white h-12 rounded-lg hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold mt-8"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Guardando...
              </>
            ) : instructor ? (
              "💾 Actualizar Instructor"
            ) : (
              "✨ Crear Instructor"
            )}
          </Button>

          <div className="text-xs text-zinc-500 text-center pt-2">
            Los campos marcados con * son obligatorios
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
