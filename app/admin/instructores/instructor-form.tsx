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

// ... (Esquema Zod y Types se mantienen igual)

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: InstructorFormProps) {
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<InstructorFormValues>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: { name: "", slug: "", bio: "", avatar_url: "", cover_url: "", instagram_url: "" },
  })

  // ESCUCHAMOS las URLs directamente del formulario
  const avatarUrl = watch("avatar_url")
  const coverUrl = watch("cover_url")
  const nameValue = watch("name")

  useEffect(() => {
    if (instructor) {
      reset({
        name: instructor.name,
        slug: instructor.slug,
        bio: instructor.bio || "",
        avatar_url: instructor.avatar_url || "",
        cover_url: instructor.cover_url || "",
        instagram_url: instructor.instagram_url || "",
      })
      setSpecialties(instructor.specialty || [])
    } else {
      reset()
      setSpecialties([])
    }
  }, [instructor, reset])

  const onSubmit = async (data: InstructorFormValues) => {
    setLoading(true)
    try {
      const result = instructor 
        ? await updateInstructor(instructor.id, { ...data, specialty: specialties }) 
        : await createInstructor({ ...data, specialty: specialties })

      if (result.error) throw new Error(result.error)
      
      toast.success(instructor ? "Actualizado" : "Creado")
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message || "Error al guardar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{instructor ? "Editar Instructor" : "Nuevo Instructor"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          
          {instructor && (
            <div className="grid gap-6">
              {/* PORTADA - Versión Horizontal */}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-muted-foreground">Foto de Portada</Label>
                <InstructorAvatarUpload
                  instructorId={`${instructor.id}-cover`}
                  currentAvatarUrl={coverUrl} // Viene del watch
                  onAvatarChange={(url) => setValue("cover_url", url, { shouldDirty: true })}
                  variant="cover" 
                />
              </div>

              {/* AVATAR - Versión Circular */}
              <div className="flex items-center gap-4 p-4 bg-zinc-50 rounded-lg">
                <div className="w-20 h-20 shrink-0">
                  <InstructorAvatarUpload
                    instructorId={instructor.id}
                    currentAvatarUrl={avatarUrl} // Viene del watch
                    onAvatarChange={(url) => setValue("avatar_url", url, { shouldDirty: true })}
                    variant="circle"
                  />
                </div>
                <div className="text-xs text-muted-foreground">Foto de perfil circular</div>
              </div>
            </div>
          )}

          {/* ... Resto de tus inputs (Nombre, Slug, Bio, etc) se quedan igual ... */}
          
          <Button type="submit" disabled={loading} className="w-full bg-black text-white">
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
