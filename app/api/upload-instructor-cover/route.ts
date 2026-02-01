import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

/**
 * POST /api/upload-instructor-cover
 * Sube la imagen de portada del instructor
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar autenticación
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: "No autenticado. Por favor inicia sesión." },
        { status: 401 }
      )
    }

    // 2. Verificar que es admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || profile?.role !== "admin") {
      return NextResponse.json(
        { error: "No tienes permisos para subir imágenes. Solo admins." },
        { status: 403 }
      )
    }

    // 3. Obtener archivo del form
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

    // 4. Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen (JPG, PNG, WebP, etc.)" },
        { status: 400 }
      )
    }

    // 5. Validar tamaño (máx 10MB para covers)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `La imagen no debe superar 10MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB` },
        { status: 400 }
      )
    }

    // 6. Eliminar cover anterior si existe
    try {
      const cleanInstructorId = instructorId.replace("-cover", "")
      const { data: instructor } = await supabase
        .from("instructors")
        .select("cover_url")
        .eq("id", cleanInstructorId)
        .single()

      if (instructor?.cover_url) {
        const urlParts = instructor.cover_url.split("/")
        const filename = urlParts[urlParts.length - 1]
        
        if (filename) {
          await supabase.storage
            .from("covers")
            .remove([`instructors/${filename}`])
            .catch(err => console.warn("No se pudo eliminar cover anterior:", err))
        }
      }
    } catch (err) {
      console.warn("Error limpiando cover anterior:", err)
    }

    // 7. Generar nombre único
    const extension = file.name.split(".").pop() || "jpg"
    const cleanInstructorId = instructorId.replace("-cover", "") // Limpiar ID para BD
    const filename = `${cleanInstructorId}-cover-${Date.now()}.${extension}`

    // 8. Convertir File a Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 9. Subir a Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("covers")
      .upload(`instructors/${filename}`, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      })

    if (uploadError) {
      console.error("[Cover Upload] Error subiendo a storage:", uploadError)
      return NextResponse.json(
        { error: `Error al subir: ${uploadError.message}` },
        { status: 500 }
      )
    }

    // 10. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("covers")
      .getPublicUrl(`instructors/${filename}`)

    const publicUrl = urlData?.publicUrl

    if (!publicUrl) {
      return NextResponse.json(
        { error: "Error generando URL pública" },
        { status: 500 }
      )
    }

    // 11. Actualizar BD
    const { error: updateError } = await supabase
      .from("instructors")
      .update({ cover_url: publicUrl })
      .eq("id", cleanInstructorId)

    if (updateError) {
      console.error("[Cover Upload] Error actualizando BD:", updateError)
      return NextResponse.json(
        { error: `Error al guardar: ${updateError.message}` },
        { status: 500 }
      )
    }

    // 12. Revalidar paths
    try {
      revalidatePath("/admin/instructores")
      revalidatePath("/instructores")
    } catch (err) {
      console.warn("Error revalidando paths:", err)
    }

    console.log("[Cover Upload] ✅ Éxito:", publicUrl)

    return NextResponse.json({ 
      url: publicUrl,
      path: uploadData.path 
    })

  } catch (error: any) {
    console.error("[Cover Upload] Error no manejado:", error)
    return NextResponse.json(
      { error: error.message || "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
