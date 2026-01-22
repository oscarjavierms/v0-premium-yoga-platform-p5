import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MiSantuarioClient } from "./mi-santuario-client"

export default async function MiSantuarioPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) { redirect("/auth/login") }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Pasamos datos de prueba por si la base de datos no responde, para que el diseño NO se rompa
  const stats = {
    diasConciencia: 12,
    minutosIntencion: 450,
    clasesCompletadas: 8
  }

  return (
    <MiSantuarioClient
      profile={profile || { full_name: "oscar" }}
      stats={stats}
      recommendedClasses={[]}
    />
  )
}
