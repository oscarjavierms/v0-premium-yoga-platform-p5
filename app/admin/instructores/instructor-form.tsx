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
  avatar_url: z.string().optional().or(z.literal("")),
  cover_url: z.string().optional().or(z.literal("")),
  instagram_url: z.string().optional().or(z.literal("")),
})

type InstructorFormValues = z.infer<typeof InstructorSchema>

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  const [newSpecialty, setNewSpecialty] = useState("")

  const { register, handleSubmit, reset, setValue, watch } = useForm<InstructorFormValues>({
    resolver: zodResolver(InstructorSchema),
    defaultValues: { name: "", slug: "", bio: "", avatar_url: "", cover_url: "", instagram_url: "" }
  })

  // "Vigilamos" las URLs para que la UI reaccione cuando cambien
  const currentCover = watch("cover_url")
  const currentAvatar = watch("avatar_url")

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
      const result = instructor 
        ? await updateInstructor(instructor.id, { ...data, specialty: specialties }) 
        : await createInstructor({ ...data, specialty: specialties })

      if (result.error) throw new Error(result.error)
      toast.success("¡Guardado exitosamente!")
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-8 pb-10">
          
          {instructor && (
            <div className="space-y-6">
              {/* PORTADA */}
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-zinc-400">Imagen de Portada</Label>
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentAvatarUrl={currentCover}
                  onAvatarChange={(url) => setValue("cover_url", url, { shouldDirty: true })}
                  variant="cover"
                />
              </div>

              {/* PERFIL */}
              <div className="flex items-center gap-6 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentAvatarUrl={currentAvatar}
                  onAvatarChange={(url) => setValue("avatar_url", url, { shouldDirty: true })}
                  variant="circle"
                />
                <div>
                  <p className="text-sm font-bold tracking-tight">Foto de perfil</p>
                  <p className="text-xs text-zinc-500">Se usará en el buscador y clases.</p>
                </div>
              </div>
            </div>
          )}

          {/* CAMPOS RESTANTES */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input {...register("name")} placeholder="Nombre completo" />
            </div>

            <div className="space-y-2">
              <Label>Instagram URL</Label>
              <Input {...register("instagram_url")} placeholder="https://instagram.com/usuario" />
            </div>

            <div className="space-y-2">
              <Label>Biografía</Label>
              <Textarea {...register("bio")} rows={4} placeholder="Cuéntanos sobre el instructor..." />
            </div>

            {/* ESPECIALIDADES */}
            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="flex gap-2">
                <Input 
                  value={newSpecialty} 
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Ej. Yoga"
                  onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); if(newSpecialty.trim()){ setSpecialties([...specialties, newSpecialty.trim()]); setNewSpecialty(""); } } }}
                />
                <Button type="button" onClick={() => { if(newSpecialty.trim()){ setSpecialties([...specialties, newSpecialty.trim()]); setNewSpecialty(""); } }} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {specialties.map((s, i) => (
                  <span key={i} className="flex items-center gap-1 bg-black text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    {s}
                    <X className="w-3 h-3 cursor-pointer ml-1" onClick={() => setSpecialties(specialties.filter((_, idx) => idx !== i))} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-black text-white h-12 rounded-xl font-bold">
            {loading ? "Guardando..." : "Finalizar y Guardar"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
