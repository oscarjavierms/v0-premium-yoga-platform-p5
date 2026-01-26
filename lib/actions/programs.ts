"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProgram(data: any, id?: string) {
  const supabase = await createClient()

  // Normalizamos la experiencia: "yoga" -> "Yoga"
  const expType = data.experience_type.charAt(0).toUpperCase() + data.experience_type.slice(1).toLowerCase();

  const programData = {
    title: data.title,
    slug: data.slug,
    description: data.description || "",
    experience_type: expType,
    difficulty: data.difficulty,
    focus_area: data.focus_area || "",
    instructor_id: data.instructor_id || null,
    is_published: Boolean(data.is_published),
    vimeo_url: data.vimeo_url || null,
    // --- AQUÍ ESTÁ LA CORRECCIÓN ---
    cover_image_url: data.cover_image_url || null, 
    // -------------------------------
    category: data.category || null,
    is_standalone_class: data.is_standalone_class || false,
    total_classes: Number(data.total_classes) || 0,
  }

  let result
  if (id) {
    result = await supabase.from("programs").update(programData).eq("id", id)
  } else {
    result = await supabase.from("programs").insert([programData])
  }

  if (result.error) {
    console.error("Error en Supabase:", result.error)
    return { error: result.error.message }
  }

  // LIMPIEZA DE CACHÉ
  revalidatePath("/admin/programas")
  revalidatePath("/(user)/[experience]", "page")
  revalidatePath(`/${data.experience_type.toLowerCase()}`)
  // Añadimos esta para que la página del programa se actualice al instante
  revalidatePath(`/programas/${data.slug}`) 
  
  return { success: true }
}

export async function deleteProgram(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("programs").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/programas")
  return { success: true }
}
