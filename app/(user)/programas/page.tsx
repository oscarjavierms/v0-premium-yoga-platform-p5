import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProgramasClient } from "./programas-client"

export const metadata = {
  title: "Programas | Transforma tu práctica",
}

export default async function ProgramasPage() {
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get featured program
  const { data: featuredProgram } = await supabase
    .from("programs")
    .select(`
      *,
      instructors (name, avatar_url),
      classes (count)
    `)
    .eq("is_published", true)
    .eq("is_featured", true)
    .single()

  // Get all programs grouped by pillar
  const { data: allPrograms } = await supabase
    .from("programs")
    .select(`
      *,
      instructors (name, avatar_url)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  // Get unique pillars
  const pillars = [...new Set(allPrograms?.map(p => p.pillar).filter(Boolean))]

  return (
    <ProgramasClient
      featuredProgram={featuredProgram}
      programs={allPrograms || []}
      pillars={pillars}
    />
  )
}
