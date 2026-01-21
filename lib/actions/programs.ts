"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const ProgramSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  duration_weeks: z.number().min(1).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  pillar: z.enum(["movement", "mindfulness", "nutrition", "sleep", "stress", "connection"]),
  instructor_id: z.string().uuid().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
})

export type ProgramFormData = z.infer<typeof ProgramSchema>

export async function createProgram(formData: ProgramFormData) {
  const supabase = await createClient()

  const validation = ProgramSchema.safeParse(formData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { data, error } = await supabase
    .from("programs")
    .insert({
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      thumbnail_url: formData.thumbnail_url || null,
      duration_weeks: formData.duration_weeks || null,
      difficulty: formData.difficulty,
      pillar: formData.pillar,
      instructor_id: formData.instructor_id || null,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un programa con ese slug" }
    }
    return { error: error.message }
  }

  revalidatePath("/admin/programas")
  return { data }
}

export async function updateProgram(id: string, formData: ProgramFormData) {
  const supabase = await createClient()

  const validation = ProgramSchema.safeParse(formData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { data, error } = await supabase
    .from("programs")
    .update({
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      thumbnail_url: formData.thumbnail_url || null,
      duration_weeks: formData.duration_weeks || null,
      difficulty: formData.difficulty,
      pillar: formData.pillar,
      instructor_id: formData.instructor_id || null,
      is_featured: formData.is_featured,
      is_published: formData.is_published,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un programa con ese slug" }
    }
    return { error: error.message }
  }

  revalidatePath("/admin/programas")
  return { data }
}

export async function deleteProgram(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("programs").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/programas")
  return { success: true }
}
