"use client"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function LikeButton({ classId, userId }: { classId: string, userId: string | undefined }) {
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (userId) checkLikeStatus()
  }, [userId])

  async function checkLikeStatus() {
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('class_id', classId)
      .eq('user_id', userId)
      .single()
    
    if (data) setIsLiked(true)
    setLoading(false)
  }

  async function toggleLike() {
    if (!userId) return alert("Debes iniciar sesión para dar me gusta")
    
    if (isLiked) {
      await supabase.from('likes').delete().eq('class_id', classId).eq('user_id', userId)
      setIsLiked(false)
    } else {
      await supabase.from('likes').insert({ class_id: classId, user_id: userId })
      setIsLiked(true)
    }
  }

  if (loading && userId) return <div className="w-10 h-10 animate-pulse bg-zinc-100 rounded-full" />

  return (
    <button onClick={toggleLike} className="flex flex-col items-center group flex-shrink-0 pt-2 transition-transform active:scale-90">
      <span className={`text-2xl transition-colors ${isLiked ? 'text-red-500' : 'text-zinc-300'} group-hover:text-red-400`}>
        {isLiked ? '❤️' : '❤'}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-tighter text-zinc-400 mt-1">
        {isLiked ? 'Guardado' : 'Me gusta'}
      </span>
    </button>
  )
}
