import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const instructorId = formData.get("instructorId") as string

    if (!file || !instructorId) {
      return NextResponse.json(
        { error: "Archivo e ID requeridos" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Obtener cover actual
    const { data: instructor } = await supabase
      .from("instructors")
      .select("cover_url")
      .eq("id", instructorId)
      .single()

    // Eliminar cover anterior si existe
    if (instructor?.cover_url) {
      try {
        // Extraer el nombre del archivo de la URL pública
        const urlParts = instructor.cover_url.split("/")
        const filename = urlParts[urlParts.length - 1]
        
        if (filename) {
          await supabase.storage
            .from("covers")
            .remove([`instructors/${filename}`])
        }
      } catch (err) {
        console.warn("[Cover Upload] No se pudo eliminar cover anterior:", err)
        // Continuar sin fallar
      }
    }

    // Crear nombre único
    const filename = `${instructorId}-${Date.now()}.jpg`

    // Subir archivo
    const { error: uploadError } = await supabase.storage
      .from("covers")
      .upload(`instructors/${filename}`, file, {
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
        { error: "Error al actualizar perfil" },
        { status: 500 }
      )
    }

    revalidatePath("/admin/instructores")
    revalidatePath("/instructores")

    return NextResponse.json({ url: publicUrl })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
