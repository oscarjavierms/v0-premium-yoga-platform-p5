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
import { updateInstructor } from "@/lib/actions/instructors"
import { InstructorAvatarUpload } from "@/components/admin/instructor-avatar-upload"
import { X, Plus, Image as ImageIcon, User, LayoutGrid } from "lucide-react"

// ... (Esquema y Types se mantienen igual, solo añade cover_url)

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: InstructorFormProps) {
  const [loading, setLoading] = useState(false)
  const [specialties, setSpecialties] = useState<string[]>([])
  
  // Observamos los valores para que el preview sea instantáneo
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<InstructorFormValues>({
    resolver: zodResolver(InstructorSchema),
  })

  const currentAvatar = watch("avatar_url")
  const currentCover = watch("cover_url")

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
    }
  }, [instructor, reset])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-white">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-2xl font-light italic">Configuración de Instructor</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
          
          {/* SECCIÓN DE IMÁGENES REFORMADA */}
          {instructor && (
            <div className="space-y-6">
              {/* PORTADA HORIZONTAL - Sin límite de 5MB */}
              <div className="space-y-2">
                <Label className="text-[10px] tracking-widest uppercase font-bold text-zinc-500 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Imagen de Portada (Full Width)
                </Label>
                <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg border-2 border-dashed border-zinc-200 hover:border-black transition-colors">
                   <InstructorAvatarUpload
                    instructorId={`${instructor.id}-cover`}
                    currentAvatarUrl={currentCover}
                    onAvatarChange={(url) => setValue("cover_url", url, { shouldDirty: true })}
                    variant="cover" // <-- Añadimos variante para que el CSS cambie a horizontal
                  />
                </div>
              </div>

              {/* PERFIL CIRCULAR */}
              <div className="flex items-center gap-6 p-4 bg-zinc-50 rounded-xl">
                <div className="w-24 h-24 shrink-0">
                  <InstructorAvatarUpload
                    instructorId={instructor.id}
                    currentAvatarUrl={currentAvatar}
                    onAvatarChange={(url) => setValue("avatar_url", url, { shouldDirty: true })}
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Foto de Perfil</h4>
                  <p className="text-xs text-muted-foreground">Esta aparecerá en los círculos flotantes.</p>
                </div>
              </div>
            </div>
          )}

          {/* ... Resto de campos (Nombre, Bio, etc) ... */}
          
          <div className="sticky bottom-0 bg-white py-4 border-t flex gap-4">
             <Button type="submit" disabled={loading} className="w-full bg-black text-white hover:bg-zinc-800 h-12 rounded-none uppercase tracking-widest text-xs">
              {loading ? "Sincronizando..." : "Guardar Cambios Premium"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
