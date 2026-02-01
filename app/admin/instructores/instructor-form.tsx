// ... (tus imports se mantienen)

export function InstructorForm({ open, onOpenChange, instructor, onSuccess }: InstructorFormProps) {
  // ... (tus estados se mantienen)

  // IMPORTANTE: Usamos watch para ver las URLs en tiempo real
  const avatarUrlWatch = watch("avatar_url")
  const coverUrlWatch = watch("cover_url")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-white">
        {/* ... Header ... */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-6">
          
          {instructor && (
            <div className="grid gap-6">
              {/* PORTADA HORIZONTAL (Punto 2) */}
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-[0.2em] font-black text-zinc-400">Foto de Portada (Panorámica)</Label>
                <InstructorAvatarUpload
                  instructorId={`${instructor.id}-cover`}
                  currentAvatarUrl={coverUrlWatch} // Usamos el watch del form
                  onAvatarChange={(url) => setValue("cover_url", url, { shouldDirty: true })}
                  variant="cover"
                />
              </div>

              {/* PERFIL REDONDO */}
              <div className="flex items-center gap-6 p-4 bg-zinc-50 rounded-2xl">
                <div className="shrink-0">
                  <InstructorAvatarUpload
                    instructorId={instructor.id}
                    currentAvatarUrl={avatarUrlWatch} // Usamos el watch del form
                    onAvatarChange={(url) => setValue("avatar_url", url, { shouldDirty: true })}
                    variant="circle"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold uppercase tracking-tight">Foto de Perfil</h4>
                  <p className="text-xs text-zinc-500 max-w-[200px]">Esta imagen aparecerá en las miniaturas de instructores.</p>
                </div>
              </div>
            </div>
          )}

          {/* ... Resto del formulario (Nombre, Slug, etc.) ... */}

          <div className="sticky bottom-0 bg-white py-4 border-t">
            <Button type="submit" disabled={loading} className="w-full h-12 bg-black text-white rounded-none uppercase tracking-widest text-xs">
              {loading ? "Sincronizando..." : instructor ? "Actualizar Instructor" : "Crear Instructor"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
