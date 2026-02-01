"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const InstructorSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  bio: z.string().optional(),
  specialty: z.array(z.string()).optional(),
  avatar_url: z.string().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  instagram_url: z.string().nullable().optional(),
})

export type InstructorFormData = z.infer<typeof InstructorSchema>

export async function createInstructor(formData: InstructorFormData) {
  const supabase = await createClient()
  
  const validation = InstructorSchema.safeParse(formData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }
  
  const { data, error } = await supabase
    .from("instructors")
    .insert({
      name: formData.name,
      slug: formData.slug,
      bio: formData.bio || null,
      specialty: formData.specialty || [],
      avatar_url: formData.avatar_url || null,
      cover_url: formData.cover_url || null,
      instagram_url: formData.instagram_url || null,
    })
    .select()
    .single()
  
  if (error) {
    console.error('[Create Instructor Error]', error)
    if (error.code === "23505") {
      return { error: "Ya existe un instructor con ese slug" }
    }
    return { error: error.message }
  }
  
  revalidatePath("/admin/instructores")
  revalidatePath("/instructores")
  return { data }
}

export async function updateInstructor(id: string, formData: InstructorFormData) {
  const supabase = await createClient()
  
  const validation = InstructorSchema.safeParse(formData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }
  
  console.log('[Update Instructor]', id, formData)
  
  const { data, error } = await supabase
    .from("instructors")
    .update({
      name: formData.name,
      slug: formData.slug,
      bio: formData.bio || null,
      specialty: formData.specialty || [],
      avatar_url: formData.avatar_url || null,
      cover_url: formData.cover_url || null,
      instagram_url: formData.instagram_url || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()
  
  if (error) {
    console.error('[Update Instructor Error]', error)
    if (error.code === "23505") {
      return { error: "Ya existe un instructor con ese slug" }
    }
    return { error: error.message }
  }
  
  console.log('[Update Instructor Success]', data)
  
  revalidatePath("/admin/instructores")
  revalidatePath("/instructores")
  revalidatePath(`/instructor/${formData.slug}`)
  return { data }
}

export async function deleteInstructor(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.from("instructors").delete().eq("id", id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath("/admin/instructores")
  revalidatePath("/instructores")
  return { success: true }
}
