import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProgramForm } from "../program-form"

export default async function ProgramPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createServerClient()

  let program = null

  // Si id === "new", modo crear (formulario vacío)
  if (id !== "new") {
    // Si no es "new", cargar datos del programa
    const { data } = await supabase.from("programs").select("*").eq("id", id).single()

    if (!data) {
      return notFound()
    }

    program = data
  }

  // Cargar instructores para el selector
  const { data: instructors } = await supabase
    .from("instructors")
    .select("id, name")
    .order("name")

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">{program ? "Editar Programa" : "Nuevo Programa"}</h1>
      <ProgramForm program={program} instructors={instructors || []} />
    </div>
  )
}
