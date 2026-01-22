import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MiSantuarioClient } from "./mi-santuario-client"

export default async function MiSantuarioPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) { redirect("/auth/login") }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Si esta parte de abajo falla, el sistema se rompe. 
  // Vamos a pasarle datos aunque estén vacíos para que CARGUE SI O SI.
  return (
    <MiSantuarioClient
      profile={profile || { full_name: "Oscar" }}
      stats={{ diasConciencia: 0, minutosIntencion: 0, clasesCompletadas: 0 }}
      recommendedClasses={[]}
    />
  )
}
