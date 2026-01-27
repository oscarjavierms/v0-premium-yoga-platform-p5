import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MiPracticaClient } from "./mi-practica-client"

export const dynamic = 'force-dynamic'

export default async function MiPracticaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Traemos los programas guardados con toda su info anidada
  const { data: savedProgramsData } = await supabase
    .from("user_practice_saved_programs")
    .select(`
      id,
      created_at,
      programs (
        id,
        title,
        slug,
        thumbnail_url,
        experience_type,
        practice_level,
        instructors (name)
      )
    `)
    .eq("user_id", user.id)

  return (
    <MiPracticaClient 
      savedPrograms={savedProgramsData || []} 
      savedClasses={[]} 
      history={[]} 
    />
  )
}
