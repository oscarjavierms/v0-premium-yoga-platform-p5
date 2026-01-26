"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProgram(formData: any) {
  const supabase = await createClient()

  // 1. Generar slug simple
  const slug = formData.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "")

  // 2. Insertar en Supabase
  const { data, error } = await supabase
    .from("programs")
    .insert([
      { 
        title: formData.title,
        description: formData.description,
        slug: slug,
        experience_type: formData.experience_type,
        difficulty: formData.difficulty,
        focus_area: formData.focus_area,
        is_published: true // Por defecto lo publicamos
      }
    ])

  if (error) {
    console.error("Error salvando:", error)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/programas") // Actualiza la lista del admin
  return { success: true }
}
