"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const ClassSchema = z.object({
  title: z.string().min(2, "El título debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  thumbnail_url: z.string().url().optional().or(z.literal("")),
  vimeo_id: z.string().optional(),
  duration_minutes: z.number().min(1).optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  pillar: z.enum(["movement", "mindfulness", "nutrition", "sleep", "stress", "connection"]),
  instructor_id: z.string().uuid().optional().nullable(),
  program_id: z.string().uuid().optional().nullable(),
  program_order: z.number().optional(),
  is_free: z.boolean().default(false),
  is_published: z.boolean().default(false),
})

export type ClassFormData = z.infer<typeof ClassSchema>

export async function createClass(formData: ClassFormData) {
  const supabase = await createClient()

  const validation = ClassSchema.safeParse(formData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { data, error } = await supabase
    .from("classes")
    .insert({
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      thumbnail_url: formData.thumbnail_url || null,
      vimeo_id: formData.vimeo_id || null,
      duration_minutes: formData.duration_minutes || null,
      difficulty: formData.difficulty,
      pillar: formData.pillar,
      instructor_id: formData.instructor_id || null,
      program_id: formData.program_id || null,
      program_order: formData.program_order || null,
      is_free: formData.is_free,
      is_published: formData.is_published,
    })
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe una clase con ese slug" }
    }
    return { error: error.message }
  }

  revalidatePath("/admin/clases")
  return { data }
}

export async function updateClass(id: string, formData: ClassFormData) {
  const supabase = await createClient()

  const validation = ClassSchema.safeParse(formData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }

  const { data, error } = await supabase
    .from("classes")
    .update({
      title: formData.title,
      slug: formData.slug,
      description: formData.description || null,
      thumbnail_url: formData.thumbnail_url || null,
      vimeo_id: formData.vimeo_id || null,
      duration_minutes: formData.duration_minutes || null,
      difficulty: formData.difficulty,
      pillar: formData.pillar,
      instructor_id: formData.instructor_id || null,
      program_id: formData.program_id || null,
      program_order: formData.program_order || null,
      is_free: formData.is_free,
      is_published: formData.is_published,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe una clase con ese slug" }
    }
    return { error: error.message }
  }

  revalidatePath("/admin/clases")
  return { data }
}

export async function deleteClass(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("classes").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/clases")
  return { success: true }
}
