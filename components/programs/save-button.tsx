"use client"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function SaveProgramButton({ programId }: { programId: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)

  // Verificar si ya está guardado al cargar
  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from("user_practice_saved_programs")
        .select("id")
        .eq("user_id", user.id)
        .eq("program_id", programId)
        .single()

      if (data) setIsSaved(true)
    }
    checkStatus()
  }, [programId])

  const handleToggleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Inicia sesión para guardar")

    if (isSaved) {
      // Lógica para ELIMINAR
      const { error } = await supabase
        .from("user_practice_saved_programs")
        .delete()
        .eq("user_id", user.id)
        .eq("program_id", programId)

      if (!error) {
        setIsSaved(false)
        alert("Clase eliminada de Mi Práctica")
      }
    } else {
      // Lógica para GUARDAR
      const { error } = await supabase
        .from("user_practice_saved_programs")
        .insert([{ user_id: user.id, program_id: programId }])

      if (!error) {
        setIsSaved(true)
        alert("Clase guardada")
        router.push('/mi-practica')
      }
    }
    router.refresh()
  }

  return (
    <button 
      onClick={handleToggleSave}
      className={`w-full py-4 border transition-all duration-500 text-[10px] font-bold uppercase tracking-[0.3em] ${
        isSaved 
        ? "bg-zinc-900 text-white border-zinc-900" 
        : "bg-transparent text-zinc-900 border-zinc-900 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      {isSaved ? "✓ En Mi Santuario" : "♡ Guardar en Mi Santuario"}
    </button>
  )
}
