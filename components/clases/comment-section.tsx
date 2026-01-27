"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function CommentSection({ claseId }: { claseId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  const supabase = createClient()

  // ✅ Cargar comentarios y usuario
  useEffect(() => {
    loadComments()
    loadUser()
  }, [claseId])

  const loadUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    setUser(currentUser)
  }

  const loadComments = async () => {
    const { data } = await supabase
      .from("class_comments")
      .select(`
        id,
        content,
        created_at,
        user:user_id(email)
      `)
      .eq("class_id", claseId)
      .order("created_at", { ascending: false })

    if (data) {
      setComments(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      alert("Debes iniciar sesión para comentar")
      return
    }

    if (!content.trim()) {
      alert("El comentario no puede estar vacío")
      return
    }

    setLoading(true)

    const { error } = await supabase.from("class_comments").insert([
      {
        class_id: claseId,
        user_id: user.id,
        content: content.trim(),
      },
    ])

    if (error) {
      alert("Error al publicar comentario: " + error.message)
    } else {
      setContent("")
      loadComments() // ✅ Recargar comentarios sin refrescar la página
    }

    setLoading(false)
  }

  return (
    <section className="pt-8 border-t border-zinc-100">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] mb-6">Comunidad</h3>

      {/* ✅ FORMULARIO PARA COMENTAR */}
      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 bg-zinc-50 border border-zinc-100 italic text-sm outline-none rounded-sm focus:border-zinc-900"
            placeholder="Comparte tu experiencia..."
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-900 text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-700 transition-colors rounded-sm disabled:opacity-50"
          >
            {loading ? "Publicando..." : "Publicar"}
          </button>
        </form>
      ) : (
        <div className="bg-zinc-50 p-4 mb-8 rounded-sm border border-zinc-100">
          <p className="text-sm text-zinc-600 italic">
            <a href="/auth/login" className="font-bold text-zinc-900 hover:underline">
              Inicia sesión
            </a>{" "}
            para compartir tu experiencia
          </p>
        </div>
      )}

      {/* ✅ MOSTRAR COMENTARIOS */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment: any) => (
            <div key={comment.id} className="border-b border-zinc-100 pb-4 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-semibold text-zinc-700">
                  {comment.user?.email || "Anónimo"}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {new Date(comment.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-zinc-600 text-sm italic">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-zinc-400 italic text-sm">Sin comentarios aún. ¡Sé el primero!</p>
        )}
      </div>
    </section>
  )
}
