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
    defaultValues: { name: "", slug: "", bio: "", avatar_url: "", cover_url: "", instagram_url: "" }
  })

  // Sincronizar datos al abrir
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

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
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
      // Incluimos specialty para que no de error de "missing property"
      const payload = { ...data, specialty: specialties }
      const result = instructor 
        ? await updateInstructor(instructor.id, payload) 
        : await createInstructor(payload)

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6 pb-10">
          
          {instructor && (
            <div className="space-y-6 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-zinc-500">Foto de Portada</Label>
                <InstructorAvatarUpload
                  instructorId={instructor.id}
                  currentAvatarUrl={watch("cover_url")}
                  onAvatarChange={(url) => setValue("cover_url", url, { shouldDirty: true })}
                  variant="cover"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20">
                  <InstructorAvatarUpload
                    instructorId={instructor.id}
                    currentAvatarUrl={watch("avatar_url")}
                    onAvatarChange={(url) => setValue("avatar_url", url, { shouldDirty: true })}
                    variant="circle"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold">Foto de Perfil</p>
                  <p className="text-xs text-zinc-500">Se usará en las miniaturas de clases.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Nombre del Instructor</Label>
              <Input {...register("name")} placeholder="Ej. Ana Yoga" />
            </div>

            <div className="grid gap-2">
              <Label>URL de Instagram</Label>
              <Input {...register("instagram_url")} placeholder="https://instagram.com/..." />
            </div>

            <div className="grid gap-2">
              <Label>Biografía</Label>
              <Textarea {...register("bio")} rows={4} placeholder="Escribe una breve bio..." />
            </div>

            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="flex gap-2">
                <Input 
                  value={newSpecialty} 
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  placeholder="Ej. Hatha, Vinyasa..."
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                />
                <Button type="button" onClick={addSpecialty} variant="outline" size="icon">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {specialties.map((s, i) => (
                  <span key={i} className="flex items-center gap-1 bg-zinc-100 px-2 py-1 rounded-md text-xs font-medium">
                    {s}
                    <button type="button" onClick={() => removeSpecialty(i)} className="hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-black text-white py-6">
            {loading ? "Guardando..." : "Guardar Instructor"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
