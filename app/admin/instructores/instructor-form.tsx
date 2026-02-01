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
  name: z.string().min(2, "El nombre es requerido"),
  slug: z.string().min(2, "El slug es requerido"),
  bio: z.string().optional(),
  avatar_url: z.string().optional().or(z.literal("")),
  cover_url: z.string().optional().or(z.literal("")),
  instagram_url: z.string().optional().or(z.literal("")),
})

type InstructorFormValues = z.infer<typeof InstructorSchema>

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<InstructorFormValues>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: {
      name: "", slug: "", bio: "", avatar_url: "", cover_url: "", instagram_url: ""
    }
  })

  // Estos "watch" aseguran que la UI vea la imagen apenas el componente la sube
  const avatarUrl = watch("avatar_url")
  const coverUrl = watch("cover_url")

  // Solo reseteamos el formulario cuando el instructor cambia (abrir/cerrar sheet)
  useEffect(() => {
    if (open) {
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
        reset({ name: "", slug: "", bio: "", avatar_url: "", cover_url: "", instagram_url: "" })
        setSpecialties([])
      }
    }
  }, [instructor, open, reset])

  const onSubmit = async (data: InstructorFormValues) => {
    setLoading(true)
    try {
      const payload = { ...data, specialty: specialties }
      const result = instructor 
        ? await updateInstructor(instructor.id, payload) 
        : await createInstructor(payload)

      if (result.error) throw new Error(result.error)

      toast.success("Guardado correctamente")
      onOpenChange(false)
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{instructor ? "Editar" : "Nuevo"} Instructor</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 pb-10">
          {instructor && (
            <div className="space-y-6">
              {/* SECCIÓN PORTADA */}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold text-zinc-400">Imagen de Portada</Label>
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentAvatarUrl={coverUrl}
                  onAvatarChange={(url) => setValue("cover_url", url, { shouldDirty: true })}
                  variant="cover"
                />
              </div>

              {/* SECCIÓN AVATAR */}
              <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded-xl">
                <div className="w-24 h-24">
                  <InstructorAvatarUpload
                    instructorId={instructor.id}
                    currentAvatarUrl={avatarUrl}
                    onAvatarChange={(url) => setValue("avatar_url", url, { shouldDirty: true })}
                    variant="circle"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">Foto de perfil</p>
                  <p className="text-xs text-zinc-500">Aparecerá en círculos.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input {...register("name")} placeholder="Nombre" />
            </div>

            <div className="space-y-2">
              <Label>Biografía</Label>
              <Textarea {...register("bio")} placeholder="Biografía..." rows={3} />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-black text-white h-12">
            {loading ? "Guardando..." : "Guardar Instructor"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
