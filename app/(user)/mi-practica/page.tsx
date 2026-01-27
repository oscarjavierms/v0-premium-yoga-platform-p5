import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MiPracticaClient } from "./mi-practica-client"

export const dynamic = 'force-dynamic'

export default async function MiPracticaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: savedProgramsData } = await supabase
    .from("user_practice_saved_programs")
    .select(`
      id,
      programs (
        id,
        title,
        slug,
        thumbnail_url,
        instructors (name)
      )
    `)
    .eq("user_id", user.id)

  // Enviamos una lista limpia
  return <MiPracticaClient savedPrograms={savedProgramsData || []} />
}
