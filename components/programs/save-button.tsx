"use client"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function SaveProgramButton({ programId }: { programId: string }) {
  const supabase = createClient()
  const router = useRouter()

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return alert("Por favor, inicia sesión para guardar en tu Santuario")

    const { error } = await supabase
      .from("user_practice_saved_programs")
      .insert([{ user_id: user.id, program_id: programId }])

    if (error) {
      if (error.code === '23505') alert("Este programa ya está en tu Santuario")
      else alert("Error al guardar")
    } else {
      alert("¡Guardado en Mi Santuario!")
      router.push('/mi-practica')
    }
  }

  return (
    <button 
      onClick={handleSave}
      className="w-full py-4 border border-zinc-900 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-500"
    >
      ♡ Guardar en Mi Santuario
    </button>
  )
}
