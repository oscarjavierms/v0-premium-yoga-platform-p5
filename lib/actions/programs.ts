"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Esta es la función que pide tu formulario (program-form.tsx)
export async function saveProgram(data: any) {
  const supabase = await createClient()

  const payload = {
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
    description: data.description,
    experience_type: data.experience_type,
    category: data.category,
    difficulty: data.difficulty,
    focus_area: data.focus_area,
    vimeo_url: data.vimeo_url,
    total_classes: data.total_classes || 0,
    is_standalone_class: data.is_standalone_class || false,
    is_published: true
  }

  // Si viene un ID, actualiza; si no, inserta
  const { error } = await supabase
    .from("programs")
    .upsert([data.id ? { id: data.id, ...payload } : payload])

  if (error) {
    console.error("Error en Supabase:", error.message)
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/programas")
  revalidatePath("/(user)/[experience]", "page")
  return { success: true }
}

// Esta es la función que pide tu lista (programs-client.tsx)
export async function deleteProgram(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("programs")
    .delete()
    .eq("id", id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/admin/programas")
  return { success: true }
}
