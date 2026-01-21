import React from "react"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserHeader } from "@/components/layout/user-header"

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <UserHeader user={profile} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}
