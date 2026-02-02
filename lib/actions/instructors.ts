"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

const InstructorSchema = z.object({
  name: z.string().min(2, "Nombre es requerido"),
  slug: z.string().min(2, "Slug es requerido"),
  bio: z.string().optional().default(""),
  specialty: z.array(z.string()).optional(),
  avatar_url: z.string().nullable().optional().default(null),
  cover_url: z.string().nullable().optional().default(null),
  instagram_url: z.string().nullable().optional().default(null),
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

export async function createInstructor(formData: any) {
  try {
    const supabase = await createClient()
    
    const validation = InstructorSchema.safeParse(formData)
    if (!validation.success) {
      console.error("❌ Validación fallida:", validation.error.errors)
      return { error: validation.error.errors[0].message }
    }

    const validData = validation.data

    const { data, error } = await supabase
      .from("instructors")
      .insert({
        name: validData.name,
        slug: validData.slug,
        bio: validData.bio || null,
        specialty: validData.specialty || [],
        avatar_url: validData.avatar_url || null,
        cover_url: validData.cover_url || null,
        instagram_url: validData.instagram_url || null,
      })
      .select()
      .single()

    if (error) {
      console.error("❌ Error en BD:", error)
      if (error.code === "23505") {
        return { error: "Ya existe un instructor con ese slug" }
      }
      return { error: error.message }
    }

    revalidatePath("/admin/instructores")
    revalidatePath("/instructores")
    return { data }
  } catch (error: any) {
    console.error("❌ Error en createInstructor:", error)
    return { error: error.message }
  }
}

export async function updateInstructor(id: string, formData: any) {
  try {
    const supabase = await createClient()

    const validation = InstructorSchema.safeParse(formData)
    if (!validation.success) {
      console.error("❌ Validación fallida:", validation.error.errors)
      return { error: validation.error.errors[0].message }
    }

    const validData = validation.data

    const { data, error } = await supabase
      .from("instructors")
      .update({
        name: validData.name,
        slug: validData.slug,
        bio: validData.bio || null,
        specialty: validData.specialty || [],
        avatar_url: validData.avatar_url || null,
        cover_url: validData.cover_url || null,
        instagram_url: validData.instagram_url || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("❌ Error en BD:", error)
      if (error.code === "23505") {
        return { error: "Ya existe un instructor con ese slug" }
      }
      return { error: error.message }
    }

    revalidatePath("/admin/instructores")
    revalidatePath("/instructores")
    return { data }
  } catch (error: any) {
    console.error("❌ Error en updateInstructor:", error)
    return { error: error.message }
  }
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
