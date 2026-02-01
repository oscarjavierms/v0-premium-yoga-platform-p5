"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const InstructorSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  slug: z.string().min(2, "El slug debe tener al menos 2 caracteres"),
  bio: z.string().optional(),
  specialty: z.array(z.string()).optional(),
  avatar_url: z.string().optional().or(z.literal("")),
  cover_url: z.string().optional().or(z.literal("")),
  instagram_url: z.string().url("URL inválida").optional().or(z.literal("")),
})

export type InstructorFormData = z.infer<typeof InstructorSchema>

export async function getInstructor(slug: string) {
  try {
    const supabase = await createClient()
    const { data: instructor, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) {
      console.error('Error obteniendo instructor:', error)
      return null
    }
    return instructor
  } catch (error) {
    console.error('Error en getInstructor:', error)
    return null
  }
}

export async function getInstructors() {
  try {
    const supabase = await createClient()
    const { data: instructors, error } = await supabase
      .from('instructors')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })
    if (error) {
      console.error('Error obteniendo instructores:', error)
      return []
    }
    return instructors
  } catch (error) {
    console.error('Error en getInstructors:', error)
    return []
  }
}

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
    if (error.code === "23505") {
      return { error: "Ya existe un instructor con ese slug" }
    }
    return { error: error.message }
  }
  revalidatePath("/admin/instructores")
  return { data }
}

export async function updateInstructor(id: string, formData: InstructorFormData) {
  const supabase = await createClient()
  const validation = InstructorSchema.safeParse(formData)
  if (!validation.success) {
    return { error: validation.error.errors[0].message }
  }
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
    })
    .eq("id", id)
    .select()
    .single()
  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe un instructor con ese slug" }
    }
    return { error: error.message }
  }
  revalidatePath("/admin/instructores")
  revalidatePath("/instructores")
  return { data }
}

export async function deleteInstructor(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("instructors").delete().eq("id", id)
  if (error) {
    return { error: error.message }
  }
  revalidatePath("/admin/instructores")
  return { success: true }
}

export async function updateInstructorOrder(instructorId: string, displayOrder: number) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("instructors")
    .update({ display_order: displayOrder })
    .eq("id", instructorId)
  if (error) {
    return { error: error.message }
  }
  revalidatePath("/admin/instructores")
  revalidatePath("/instructores")
  return { success: true }
}
