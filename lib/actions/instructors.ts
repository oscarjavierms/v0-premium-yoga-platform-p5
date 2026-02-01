'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

/**
 * OBTENER UN INSTRUCTOR POR SLUG - VERSIÓN CORREGIDA
 */
export async function getInstructor(slug: string) {
  try {
    const supabase = await createClient()

    // Buscar por slug (case-insensitive)
    const { data: instructor, error } = await supabase
      .from('instructors')
      .select('*')
      .ilike('slug', slug)
      .single()

    if (error) {
      console.log('Instructor no encontrado con slug:', slug)
      console.log('Error:', error)
      return null
    }

    console.log('✅ Instructor encontrado:', instructor)
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

    return instructors || []
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
  avatar_url?: string | null
  cover_url?: string | null
  instagram_url?: string | null
  specialty?: string[]
}) {
  try {
    const supabase = await createClient()

    // 1. Validar que sea admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.user?.id) {
      return { error: 'No autenticado' }
    }

    // 2. Validar datos
    if (!data.name || !data.slug) {
      return { error: 'Nombre y slug son requeridos' }
    }

    // 3. Insertar instructor
    const { data: instructor, error } = await supabase
      .from('instructors')
      .insert([
        {
          name: data.name.trim(),
          slug: data.slug.trim().toLowerCase(),
          bio: data.bio?.trim() || '',
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
      return { error: error.message || 'Error creando instructor' }
    }

    // 4. Revalidar cache
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
    avatar_url?: string | null
    cover_url?: string | null
    instagram_url?: string | null
    specialty?: string[]
  }
) {
  try {
    const supabase = await createClient()

    // 1. Validar que sea admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.user?.id) {
      return { error: 'No autenticado' }
    }

    // 2. Construir objeto de actualización
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (data.name) updateData.name = data.name.trim()
    if (data.slug) updateData.slug = data.slug.trim().toLowerCase()
    if (data.bio !== undefined) updateData.bio = data.bio?.trim() || ''
    if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url
    if (data.cover_url !== undefined) updateData.cover_url = data.cover_url
    if (data.instagram_url !== undefined) updateData.instagram_url = data.instagram_url
    if (data.specialty) updateData.specialty = data.specialty

    // 3. Actualizar instructor
    const { data: instructor, error } = await supabase
      .from('instructors')
      .update(updateData)
      .eq('id', instructorId)
      .select()
      .single()

    if (error) {
      console.error('Error actualizando instructor:', error)
      return { error: error.message || 'Error actualizando instructor' }
    }

    // 4. Revalidar cache
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
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.user?.id) {
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

    // 3. Eliminar archivos del storage si existen
    if (instructor?.avatar_url) {
      try {
        const avatarPath = instructor.avatar_url.split('/').pop()
        if (avatarPath) {
          await supabase.storage.from('avatars').remove([avatarPath])
        }
      } catch (e) {
        console.warn('Error eliminando avatar:', e)
      }
    }

    if (instructor?.cover_url) {
      try {
        const coverPath = instructor.cover_url.split('/').pop()
        if (coverPath) {
          await supabase.storage.from('covers').remove([coverPath])
        }
      } catch (e) {
        console.warn('Error eliminando cover:', e)
      }
    }

    // 4. Eliminar instructor de la BD
    const { error: deleteError } = await supabase
      .from('instructors')
      .delete()
      .eq('id', instructorId)

    if (deleteError) {
      console.error('Error eliminando instructor:', deleteError)
      return { error: deleteError.message || 'Error eliminando instructor' }
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
