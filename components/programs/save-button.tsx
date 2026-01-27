"use client"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function SaveProgramButton({ programId }: { programId: string }) {
  const supabase = createClient()
  const router = useRouter()
  const [isSaved, setIsSaved] = useState(false)
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push("/login")

    if (isSaved) {
      await supabase.from("user_practice_saved_programs").delete()
        .eq("user_id", user.id).eq("program_id", programId)
      setIsSaved(false)
    } else {
      await supabase.from("user_practice_saved_programs").insert([{ user_id: user.id, program_id: programId }])
      setIsSaved(true)
    }
    setLoading(false)
    router.refresh() // Esto asegura que aparezca en la otra página
  }

  return (
    <button 
      onClick={handleToggleSave}
      disabled={loading}
      className={`w-full py-4 border text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 ${
        isSaved ? "bg-zinc-900 text-white border-zinc-900" : "bg-transparent text-zinc-900 border-zinc-900 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      {loading ? "Procesando..." : isSaved ? "✓ En Mi Santuario" : "♡ Guardar en Mi Santuario"}
    </button>
  )
}
