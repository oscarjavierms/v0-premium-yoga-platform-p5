"use server"

import { createClient } from "@/lib/supabase/server" // Ajusta la ruta a tu cliente de supabase
import { revalidatePath } from "next/cache"

export async function saveProgram(data: any, id?: string) {
  const supabase = await createClient()

  const programData = {
    title: data.title,
    slug: data.slug,
    description: data.description,
    experience_type: data.experience_type,
    difficulty: data.difficulty,
    focus_area: data.focus_area,
    instructor_id: data.instructor_id,
    is_published: data.is_published,
  }

  if (id) {
    // Actualizar
    const { error } = await supabase
      .from("programs")
      .update(programData)
      .eq("id", id)
    if (error) return { error: error.message }
  } else {
    // Crear nuevo
    const { error } = await supabase
      .from("programs")
      .insert([programData])
    if (error) return { error: error.message }
  }

  // Esto limpia la caché para que el usuario vea los cambios al instante
  revalidatePath("/admin/programas")
  revalidatePath("/programas") 
  
  return { success: true }
}
