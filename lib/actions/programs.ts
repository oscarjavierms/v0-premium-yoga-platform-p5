"use server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveContent(data: any) {
  const supabase = await createClient()

  const payload = {
    title: data.title,
    slug: data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
    description: data.description,
    experience_type: data.experience_type, // Yoga, Meditacion, Fitness
    category: data.category,
    difficulty: data.difficulty,
    focus_area: data.focus_area,
    vimeo_url: data.vimeo_url,
    total_classes: data.total_classes || 0,
    is_standalone_class: data.is_standalone_class, // Booleano
    is_published: true
  }

  const { error } = await supabase
    .from("programs")
    .upsert([payload]) // Esto crea o actualiza

  if (error) throw new Error(error.message)

  // Esto actualiza las páginas de usuario automáticamente
  revalidatePath("/(user)/[experience]", "layout")
  return { success: true }
}
