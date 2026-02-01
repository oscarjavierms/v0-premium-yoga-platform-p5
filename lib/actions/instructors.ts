// Agregar esto a tu archivo: lib/actions/instructors.ts

/**
 * OBTENER UN INSTRUCTOR POR SLUG
 * 
 * Esta función busca un instructor en la base de datos por su slug
 * y retorna todos sus datos (nombre, bio, fotos, especialidades, etc)
 */

export async function getInstructor(slug: string) {
  try {
    // 1. Crear cliente de Supabase
    const supabase = await createClient()

    // 2. Buscar el instructor por slug
    const { data: instructor, error } = await supabase
      .from('instructors')
      .select('*')
      .eq('slug', slug)
      .single()

    // 3. Manejar error si no existe
    if (error) {
      console.error('Error obteniendo instructor:', error)
      return null
    }

    // 4. Retornar los datos
    return instructor

  } catch (error) {
    console.error('Error en getInstructor:', error)
    return null
  }
}

/**
 * OBTENER TODOS LOS INSTRUCTORES
 * 
 * Esta función obtiene la lista de todos los instructores
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
