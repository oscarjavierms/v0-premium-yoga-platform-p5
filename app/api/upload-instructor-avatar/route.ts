import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    // Verificar que es admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
    }

    // Obtener el form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const instructorId = formData.get('instructorId') as string

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    if (!instructorId) {
      return NextResponse.json({ error: 'No se proporcionó instructorId' }, { status: 400 })
    }

    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'El archivo debe ser una imagen' }, { status: 400 })
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'La imagen no debe superar 5MB' }, { status: 400 })
    }

    // Obtener extensión del archivo
    const extension = file.name.split('.').pop() || 'jpg'
    
    // Crear nombre único con timestamp
    const filename = `${instructorId}-${Date.now()}.${extension}`
    
    // Convertir File a ArrayBuffer y luego a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`instructors/${filename}`, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('[Upload Error]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(`instructors/${filename}`)

    console.log('[Upload Success]', urlData.publicUrl)

    return NextResponse.json({ 
      url: urlData.publicUrl,
      path: data.path 
    })

  } catch (error: any) {
    console.error('[API Error]', error)
    return NextResponse.json(
      { error: error.message || 'Error al subir imagen' },
      { status: 500 }
    )
  }
}
