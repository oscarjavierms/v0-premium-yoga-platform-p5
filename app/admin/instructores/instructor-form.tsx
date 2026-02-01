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
import { createInstructor, updateInstructor } from "@/lib/actions/instructors"
import { InstructorAvatarUpload } from "@/components/admin/instructor-avatar-upload"

const InstructorSchema = z.object({
  name: z.string().min(2, "Requerido"),
  slug: z.string().min(2, "Requerido"),
  bio: z.string().optional(),
  avatar_url: z.string().optional().or(z.literal("")),
  cover_url: z.string().optional().or(z.literal("")),
  instagram_url: z.string().optional().or(z.literal("")),
})

type InstructorFormValues = z.infer<typeof InstructorSchema>

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: any) {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, setValue, watch } = useForm<InstructorFormValues>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: { name: "", slug: "", bio: "", avatar_url: "", cover_url: "", instagram_url: "" }
  })

  // Sincronización de datos al abrir
  useEffect(() => {
    if (open && instructor) {
      reset({
        name: instructor.name,
        slug: instructor.slug,
        bio: instructor.bio || "",
        avatar_url: instructor.avatar_url || "",
        cover_url: instructor.cover_url || "",
        instagram_url: instructor.instagram_url || "",
      })
    } else if (open) {
      reset({ name: "", slug: "", bio: "", avatar_url: "", cover_url: "", instagram_url: "" })
    }
  }, [instructor, open, reset])

  const onSubmit = async (data: InstructorFormValues) => {
    setLoading(true)
    try {
      const result = instructor 
        ? await updateInstructor(instructor.id, data) 
        : await createInstructor(data)
      
      if (result.error) throw new Error(result.error)
      toast.success("Guardado")
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
          <SheetTitle>{instructor ? "Editar Instructor" : "Nuevo Instructor"}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* FOTOS - Solo se muestran si el instructor ya existe */}
          {instructor && (
            <div className="space-y-4 p-4 bg-zinc-50 rounded-xl">
              <div>
                <Label className="text-[10px] font-bold uppercase mb-2 block">Foto de Portada</Label>
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentAvatarUrl={watch("cover_url")}
                  onAvatarChange={(url) => setValue("cover_url", url)}
                  variant="cover"
                />
              </div>
              <div className="flex items-center gap-4">
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentAvatarUrl={watch("avatar_url")}
                  onAvatarChange={(url) => setValue("avatar_url", url)}
                  variant="circle"
                />
                <div className="text-xs">
                  <p className="font-bold">Foto de Perfil</p>
                  <p className="text-muted-foreground">Formato circular.</p>
                </div>
              </div>
            </div>
          )}

          {/* CAMPOS DE TEXTO */}
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input {...register("name")} />
            </div>

            <div className="grid gap-2">
              <Label>Instagram URL</Label>
              <Input {...register("instagram_url")} placeholder="https://instagram.com/perfil" />
            </div>

            <div className="grid gap-2">
              <Label>Biografía</Label>
              <Textarea {...register("bio")} rows={4} />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-black text-white">
            {loading ? "Cargando..." : "Guardar Cambios"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
