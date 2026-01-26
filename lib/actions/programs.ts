"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const ProgramSchema = z.object({
  title: z.string().min(2, "El título es obligatorio"),
  slug: z.string().min(2, "El slug es obligatorio"),
  description: z.string().optional(),
  experience_type: z.enum(["Yoga", "Meditacion", "Fitness"]),
  category: z.string().optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  focus_area: z.string().optional(),
  total_classes: z.number().default(0),
  is_published: z.boolean().default(false),
  instructor_id: z.string().uuid().optional().nullable(),
})

export async function saveProgram(formData: any, id?: string) {
  const supabase = await createClient()

  const validation = ProgramSchema.safeParse(formData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const dataToSave = {
    title: validation.data.title,
    slug: validation.data.slug,
    description: validation.data.description,
    pillar: validation.data.experience_type.toLowerCase(),
    difficulty: validation.data.difficulty,
    category: validation.data.category,
    focus_area: validation.data.focus_area,
    total_classes: validation.data.total_classes,
    is_published: validation.data.is_published,
    instructor_id: validation.data.instructor_id,
  }

  const query = id 
    ? supabase.from("programs").update(dataToSave).eq("id", id) 
    : supabase.from("programs").insert([dataToSave])

  const { error } = await query
  if (error) return { error: error.message }

  revalidatePath("/admin/programas")
  return { success: true }
}
