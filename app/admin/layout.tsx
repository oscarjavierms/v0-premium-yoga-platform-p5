import type React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminSidebar from "./components/admin-sidebar"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  try {
    // Check if user is admin
    const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    // If there's an error or role column doesn't exist, check if user email is admin
    if (error || !profile) {
      // Fallback: allow first user or specific admin email
      const isAdminEmail = user.email?.endsWith("@admin.com") || user.email === "admin@wellness.com"
      if (!isAdminEmail) {
        redirect("/dashboard")
      }
    } else if (profile.role !== "admin") {
      redirect("/dashboard")
    }
  } catch {
    // If profiles table doesn't exist or role column missing, redirect
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto lg:ml-0">{children}</main>
    </div>
  )
}
