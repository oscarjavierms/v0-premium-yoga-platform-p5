"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function ProgramForm({ open, onOpenChange, program, instructors }: any) {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      pillar: "movement"
    }
  })

  // CLAVE: Cuando el programa cambia (al dar click en editar), reseteamos el formulario con sus datos
  useEffect(() => {
    if (program) {
      form.reset({
        title: program.title || "",
        description: program.description || "",
        pillar: program.pillar || "movement"
      })
    } else {
      form.reset({ title: "", description: "", pillar: "movement" })
    }
  }, [program, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{program ? "Editar Programa" : "Nuevo Programa"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4">
          <input {...form.register("title")} className="w-full border p-2" placeholder="Título" />
          <textarea {...form.register("description")} className="w-full border p-2" placeholder="Descripción" />
          <Button type="submit">{program ? "Guardar Cambios" : "Crear Programa"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
