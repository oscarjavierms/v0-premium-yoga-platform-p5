import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error_description = searchParams.get("error_description")
  
  // Cambiamos el fallback de /dashboard a /mi-santuario para que sea más directo
  let next = searchParams.get("next") ?? "/mi-santuario"

  if (error_description) {
    console.log("[v0] Auth callback error:", error_description)
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error_description)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // 1. Buscamos el perfil existente y su rol
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id, role")
          .eq("id", user.id)
          .single()

        if (!existingProfile) {
          console.log("[v0] Profile not found, creating manually for user:", user.id)
          
          const fullName =
            [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(" ") ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            ""

          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || "",
            role: "user", // Rol por defecto
          })

          if (insertError) {
            console.error("[v0] Error creating profile:", insertError)
          }
        } else {
          console.log("[v0] Profile exists. Role:", existingProfile.role)
          
          // LÓGICA DE REDIRECCIÓN PARA ADMIN
          // Si el usuario es admin, podemos forzar que vaya al panel de control
          if (existingProfile.role === 'admin') {
            next = '/admin' // Cambia esto si tu ruta de admin es diferente
          }
        }
      }

      // IMPORTANTE: Limpiamos la URL para evitar bucles en Safari
      const finalUrl = new URL(next, origin)
      return NextResponse.redirect(finalUrl.toString())

    } else {
      console.log("[v0] Code exchange error:", error.message)
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error?error=No authentication code provided`)
}
