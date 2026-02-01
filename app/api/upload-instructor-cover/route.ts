import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const instructorId = formData.get("instructorId") as string

    // Validaciones básicas
    if (!file || !instructorId) {
      return NextResponse.json(
        { error: "Archivo e ID requeridos" },
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

    // Validar tamaño (máx 10MB para covers)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "La imagen no debe superar 10MB" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verificar autenticación
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    // Verificar que es admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      )
    }

    // Obtener cover actual para eliminarlo después
    const { data: instructor } = await supabase
      .from("instructors")
      .select("cover_url")
      .eq("id", instructorId)
      .single()

    // Eliminar cover anterior si existe
    if (instructor?.cover_url) {
      try {
        const urlParts = instructor.cover_url.split("/")
        const filename = urlParts[urlParts.length - 1]
        
        if (filename) {
          await supabase.storage
            .from("covers")
            .remove([`instructors/${filename}`])
        }
      } catch (err) {
        console.warn("[Cover Upload] No se pudo eliminar cover anterior:", err)
      }
    }

    // Crear nombre único
    const extension = file.name.split(".").pop() || "jpg"
    const filename = `${instructorId}-${Date.now()}.${extension}`

    // Convertir a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from("covers")
      .upload(`instructors/${filename}`, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("[Cover Upload] Error subiendo:", uploadError)
      return NextResponse.json(
        { error: uploadError.message || "Error al subir la foto" },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("covers")
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
      .update({ cover_url: publicUrl })
      .eq("id", instructorId)

    if (updateError) {
      console.error("[Cover Upload] Error actualizando BD:", updateError)
      return NextResponse.json(
        { error: "Error al actualizar perfil: " + updateError.message },
        { status: 500 }
      )
    }

    // Revalidar paths
    revalidatePath("/admin/instructores")
    revalidatePath("/instructores")

    return NextResponse.json({ url: publicUrl })

  } catch (error) {
    console.error("[Cover Upload] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
