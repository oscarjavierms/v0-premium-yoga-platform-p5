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
  instagram_url: z.string().url("URL inválida").optional().or(z.literal("")),
})

export type InstructorFormData = z.infer<typeof InstructorSchema>

// ✅ MEJORADO: Upload con eliminación de avatar anterior
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

  try {
    // ✅ NUEVO: Obtener avatar actual para eliminarlo
    const { data: instructor } = await supabase
      .from("instructors")
      .select("avatar_url")
      .eq("id", instructorId)
      .single()

    // Si existe avatar anterior, eliminarlo de Storage
    if (instructor?.avatar_url) {
      const oldPath = instructor.avatar_url.split("/avatars/instructors/")[1]
      if (oldPath) {
        await supabase.storage
          .from("avatars")
          .remove([`instructors/${oldPath}`])
          .catch((err) => {
            // No fallar si no se puede eliminar el viejo
            console.warn("[Avatar Upload] No se pudo eliminar avatar anterior:", err)
          })
      }
    }

    // Crear nombre único con timestamp
    const filename = `${instructorId}-${Date.now()}.jpg`

    // Subir nueva imagen
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`instructors/${filename}`, file, {
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      return { error: error.message }
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(`instructors/${filename}`)

    const publicUrl = urlData.publicUrl

    // ✅ NUEVO: Actualizar avatar_url en la tabla de instructores
    const { error: updateError } = await supabase
      .from("instructors")
      .update({ avatar_url: publicUrl })
      .eq("id", instructorId)

    if (updateError) {
      return { error: "Error al actualizar el perfil del instructor" }
    }

    return { data: publicUrl }
  } catch (error) {
    console.error("[Avatar Upload] Error:", error)
    return { error: "Error al procesar la imagen" }
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
