import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Verificar que es admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 })
    }

    // Obtener datos del formulario
    const formData = await request.formData()
    const file = formData.get("file") as File
    const instructorId = formData.get("instructorId") as string

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      )
    }

    if (!instructorId) {
      return NextResponse.json(
        { error: "No se proporcionó instructorId" },
        { status: 400 }
      )
    }

    // Validar que sea imagen
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen" },
        { status: 400 }
      )
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen no debe superar 5MB" },
        { status: 400 }
      )
    }

    // Obtener avatar actual para eliminarlo
    const { data: instructor } = await supabase
      .from("instructors")
      .select("avatar_url")
      .eq("id", instructorId)
      .single()

    // Eliminar avatar anterior si existe
    if (instructor?.avatar_url) {
      try {
        const urlParts = instructor.avatar_url.split("/")
        const filename = urlParts[urlParts.length - 1]
        
        if (filename) {
          await supabase.storage
            .from("avatars")
            .remove([`instructors/${filename}`])
        }
      } catch (err) {
        console.warn("[Avatar Upload] No se pudo eliminar avatar anterior:", err)
      }
    }

    // Crear nombre único
    const extension = file.name.split(".").pop() || "jpg"
    const filename = `${instructorId}-${Date.now()}.${extension}`
    
    // Convertir a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir a Storage
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(`instructors/${filename}`, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (error) {
      console.error("[Avatar Upload] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(`instructors/${filename}`)

    const publicUrl = urlData.publicUrl

    if (!publicUrl) {
      return NextResponse.json(
        { error: "Error generando URL pública" },
        { status: 500 }
      )
    }

    // Actualizar en BD
    const { error: updateError } = await supabase
      .from("instructors")
      .update({ avatar_url: publicUrl })
      .eq("id", instructorId)

    if (updateError) {
      console.error("[Avatar Upload] Error actualizando BD:", updateError)
      return NextResponse.json(
        { error: "Error al actualizar perfil: " + updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      url: publicUrl,
      path: data.path 
    })

  } catch (error: any) {
    console.error("[Avatar Upload] Error:", error)
    return NextResponse.json(
      { error: error.message || "Error al subir imagen" },
      { status: 500 }
    )
  }
}
