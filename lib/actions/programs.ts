"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function saveProgram(data: any, id?: string) {
  const supabase = await createClient()

  const programData = {
    title: data.title,
    slug: data.slug || data.title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
    description: data.description || "",
    experience_type: data.experience_type,
    difficulty: data.difficulty,
    focus_area: data.focus_area,
    instructor_id: data.instructor_id || null,
    is_published: data.is_published,
    // Campos Premium
    vimeo_url: data.vimeo_url || null,
    category: data.category || null,
    is_standalone_class: data.is_standalone_class || false,
    total_classes: Number(data.total_classes) || 0,
  }

  let result

  if (id) {
    result = await supabase
      .from("programs")
      .update(programData)
      .eq("id", id)
  } else {
    result = await supabase
      .from("programs")
      .insert([programData])
  }

  if (result.error) {
    console.error("Supabase Error:", result.error)
    return { error: result.error.message }
  }

  revalidatePath("/admin/programas")
  revalidatePath("/(user)/[experience]", "page")
  
  return { success: true }
}

export async function deleteProgram(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("programs").delete().eq("id", id)
  if (error) return { error: error.message }
  revalidatePath("/admin/programas")
  return { success: true }
}
