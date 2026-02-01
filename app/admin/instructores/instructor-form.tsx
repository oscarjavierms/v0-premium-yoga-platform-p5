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
  name: z.string().min(2, "Requerido"),
  slug: z.string().min(2, "Requerido"),
  bio: z.string().optional(),
  avatar_url: z.string().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
})

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    resolver: zodResolver(InstructorSchema),
    defaultValues: { 
      name: "", slug: "", bio: "", avatar_url: "", cover_url: "", instagram_url: "" 
    }
  })

  // Leemos los valores actuales para que la imagen sepa qué mostrar
  const valCover = watch("cover_url")
  const valAvatar = watch("avatar_url")

  useEffect(() => {
    if (open) {
      if (instructor) {
        reset({
          name: instructor.name || "",
          slug: instructor.slug || "",
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

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const result = instructor 
        ? await updateInstructor(instructor.id, { ...data, specialty: specialties }) 
        : await createInstructor({ ...data, specialty: specialties })

      if (result.error) throw new Error(result.error)
      toast.success("Instructor guardado con éxito")
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
        <SheetHeader><SheetTitle>Configuración de Instructor</SheetTitle></SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 pb-10">
          
          {instructor && (
            <div className="space-y-6 bg-zinc-50 p-6 rounded-2xl border border-zinc-200">
              {/* CAMPO PORTADA */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-zinc-500">Imagen de Portada (21:9)</Label>
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentImageUrl={valCover}
                  onImageChange={(url) => {
                    setValue("cover_url", url, { shouldDirty: true, shouldValidate: true })
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
                    setValue("avatar_url", url, { shouldDirty: true, shouldValidate: true })
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

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input {...register("name")} />
            </div>

            <div className="grid gap-2">
              <Label>Instagram URL</Label>
              <Input {...register("instagram_url")} placeholder="https://..." />
            </div>

            <div className="grid gap-2">
              <Label>Biografía</Label>
              <Textarea {...register("bio")} rows={4} />
            </div>

            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="flex gap-2">
                <Input value={newSpecialty} onChange={(e) => setNewSpecialty(e.target.value)} />
                <Button type="button" onClick={() => { if(newSpecialty){ setSpecialties([...specialties, newSpecialty]); setNewSpecialty(""); } }}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {specialties.map((s, i) => (
                  <span key={i} className="bg-black text-white px-3 py-1 rounded-full text-[10px] flex items-center gap-2">
                    {s} <X className="w-3 h-3 cursor-pointer" onClick={() => setSpecialties(specialties.filter((_, idx) => idx !== i))} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-black text-white h-12 rounded-xl">
            {loading ? "Guardando..." : "Guardar Instructor"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
