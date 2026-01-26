"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Función para GUARDAR (Crear o Editar)
export async function saveProgram(formData: any) {
  const supabase = await createClient()

  const programData = {
    title: formData.title,
    slug: formData.slug || formData.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
    description: formData.description,
    experience_type: formData.experience_type,
    difficulty: formData.difficulty,
    focus_area: formData.focus_area,
    instructor_id: formData.instructor_id,
    is_published: true,
  }

  const { error } = await supabase
    .from("programs")
    .upsert([programData]) // Upsert crea si no existe, actualiza si existe

  if (error) {
    console.error("Error en Supabase:", error)
    throw new Error(error.message)
  }

  revalidatePath("/admin/programas")
  revalidatePath("/programas")
  return { success: true }
}

// Función para BORRAR (La que causó el error de build)
export async function deleteProgram(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error al borrar:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/programas")
  return { success: true }
}
