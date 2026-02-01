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
      const oldPath = instructor.cover_url.split("/covers/instructors/")[1]
      if (oldPath) {
        await supabase.storage
          .from("covers")
          .remove([`instructors/${oldPath}`])
          .catch(() => {})
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
      return NextResponse.json(
        { error: uploadError.message },
        { status: 500 }
      )
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("covers")
      .getPublicUrl(`instructors/${filename}`)

    const publicUrl = urlData.publicUrl

    // Actualizar en BD
    const { error: updateError } = await supabase
      .from("instructors")
      .update({ cover_url: publicUrl })
      .eq("id", instructorId)

    if (updateError) {
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
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
