import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const error_description = searchParams.get("error_description")
  const next = searchParams.get("next") ?? "/dashboard"

  if (error_description) {
    console.log("[v0] Auth callback error:", error_description)
    return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error_description)}`)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Check if profile exists, create if not (fallback for trigger)
        const { data: existingProfile } = await supabase.from("profiles").select("id").eq("id", user.id).single()

        if (!existingProfile) {
          console.log("[v0] Profile not found, creating manually for user:", user.id)
          const fullName =
            [user.user_metadata?.first_name, user.user_metadata?.last_name].filter(Boolean).join(" ") ||
            user.user_metadata?.full_name ||
            ""

          const { error: insertError } = await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            avatar_url: user.user_metadata?.avatar_url || "",
            role: "user",
          })

          if (insertError) {
            console.error("[v0] Error creating profile:", insertError)
          } else {
            console.log("[v0] Profile created successfully")
          }
        } else {
          console.log("[v0] Profile already exists for user:", user.id)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    } else {
      console.log("[v0] Code exchange error:", error.message)
      return NextResponse.redirect(`${origin}/auth/error?error=${encodeURIComponent(error.message)}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error?error=No authentication code provided`)
}
