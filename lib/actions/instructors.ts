'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * OBTENER UN INSTRUCTOR POR SLUG
 */
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

/**
 * OBTENER TODOS LOS INSTRUCTORES
 */
export async function getInstructors() {
  try {
    const supabase = await createClient()

    const { data: instructors, error } = await supabase
      .from('instructors')
      .select('*')
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

/**
 * CREAR UN NUEVO INSTRUCTOR
 */
export async function createInstructor(data: {
  name: string
  slug: string
  bio?: string
  avatar_url?: string
  cover_url?: string
  instagram_url?: string
  specialty?: string[]
}) {
  try {
    const supabase = await createClient()

    // 1. Validar que sea admin
    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) {
      return { error: 'No autenticado' }
    }

    // 2. Insertar instructor
    const { data: instructor, error } = await supabase
      .from('instructors')
      .insert([
        {
          name: data.name,
          slug: data.slug,
          bio: data.bio || '',
          avatar_url: data.avatar_url || null,
          cover_url: data.cover_url || null,
          instagram_url: data.instagram_url || null,
          specialty: data.specialty || [],
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Error creando instructor:', error)
      return { error: error.message }
    }

    // 3. Revalidar cache
    revalidatePath('/instructores')
    revalidatePath('/instructor')

    return { success: true, data: instructor }
  } catch (error: any) {
    console.error('Error en createInstructor:', error)
    return { error: error.message || 'Error creando instructor' }
  }
}

/**
 * ACTUALIZAR UN INSTRUCTOR
 */
export async function updateInstructor(
  instructorId: string,
  data: {
    name?: string
    slug?: string
    bio?: string
    avatar_url?: string
    cover_url?: string
    instagram_url?: string
    specialty?: string[]
  }
) {
  try {
    const supabase = await createClient()

    // 1. Validar que sea admin
    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) {
      return { error: 'No autenticado' }
    }

    // 2. Actualizar instructor
    const { data: instructor, error } = await supabase
      .from('instructors')
      .update({
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatar_url !== undefined && { avatar_url: data.avatar_url }),
        ...(data.cover_url !== undefined && { cover_url: data.cover_url }),
        ...(data.instagram_url !== undefined && { instagram_url: data.instagram_url }),
        ...(data.specialty && { specialty: data.specialty }),
        updated_at: new Date().toISOString(),
      })
      .eq('id', instructorId)
      .select()
      .single()

    if (error) {
      console.error('Error actualizando instructor:', error)
      return { error: error.message }
    }

    // 3. Revalidar cache
    revalidatePath('/instructores')
    revalidatePath('/instructor')

    return { success: true, data: instructor }
  } catch (error: any) {
    console.error('Error en updateInstructor:', error)
    return { error: error.message || 'Error actualizando instructor' }
  }
}

/**
 * ELIMINAR UN INSTRUCTOR
 */
export async function deleteInstructor(instructorId: string) {
  try {
    const supabase = await createClient()

    // 1. Validar que sea admin
    const { data: user } = await supabase.auth.getUser()
    if (!user?.user) {
      return { error: 'No autenticado' }
    }

    // 2. Obtener instructor para saber qué archivos eliminar
    const { data: instructor, error: getError } = await supabase
      .from('instructors')
      .select('*')
      .eq('id', instructorId)
      .single()

    if (getError) {
      return { error: 'Instructor no encontrado' }
    }

    // 3. Eliminar archivos del storage
    if (instructor.avatar_url) {
      const avatarPath = instructor.avatar_url.split('/').pop()
      if (avatarPath) {
        await supabase.storage.from('avatars').remove([avatarPath])
      }
    }

    if (instructor.cover_url) {
      const coverPath = instructor.cover_url.split('/').pop()
      if (coverPath) {
        await supabase.storage.from('covers').remove([coverPath])
      }
    }

    // 4. Eliminar instructor de la BD
    const { error: deleteError } = await supabase
      .from('instructors')
      .delete()
      .eq('id', instructorId)

    if (deleteError) {
      console.error('Error eliminando instructor:', deleteError)
      return { error: deleteError.message }
    }

    // 5. Revalidar cache
    revalidatePath('/instructores')
    revalidatePath('/instructor')

    return { success: true }
  } catch (error: any) {
    console.error('Error en deleteInstructor:', error)
    return { error: error.message || 'Error eliminando instructor' }
  }
}
