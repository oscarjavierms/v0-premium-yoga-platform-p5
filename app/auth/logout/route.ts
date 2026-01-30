import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Sign out from Supabase - this invalidates the session and clears cookies
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("[v0] Logout error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log("[v0] User signed out successfully")

  // Return success response - client will handle redirect
  return NextResponse.json({ success: true })
}

export async function GET() {
  const supabase = await createClient()
  
  await supabase.auth.signOut()
  
  return NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
}
