import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ClassFormWrapper } from "./class-form-wrapper"

export default async function ClassPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createServerClient()

  let classItem = null

  // Si id === "new", modo crear (formulario vacío)
  if (id !== "new") {
    // Si no es "new", cargar datos de la clase
    const { data } = await supabase.from("classes").select("*").eq("id", id).single()

    if (!data) {
      return notFound()
    }

    classItem = data
  }

  // Cargar instructores y programas para los selectores
  const [{ data: instructors }, { data: programs }] = await Promise.all([
    supabase.from("instructors").select("id, name").order("name"),
    supabase.from("programs").select("id, title").order("title"),
  ])

  return (
    <ClassFormWrapper
      classItem={classItem}
      instructors={instructors || []}
      programs={programs || []}
    />
  )
}
