"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function PerfilPage() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => { getProfile() }, [])

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push("/login")
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
      if (data) {
        setProfile(data); setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || ""); setBio(data.bio || "");
      }
    } catch (error) { console.error(error) } finally { setLoading(false) }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault(); setUpdating(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from("profiles").upsert({
      id: user?.id, full_name: fullName, avatar_url: avatarUrl, bio: bio, updated_at: new Date(),
    })
    if (error) alert("Error: " + error.message)
    else alert("Perfil actualizado")
    setUpdating(false)
  }

  async function uploadAvatar(event: any) {
    try {
      setUpdating(true)
      const file = event.target.files[0]
      const filePath = `${Math.random()}.${file.name.split('.').pop()}`
      await supabase.storage.from('avatars').upload(filePath, file)
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(publicUrl)
    } catch (error: any) { alert(error.message) } finally { setUpdating(false) }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center font-cormorant italic text-zinc-400">Cargando santuario...</div>

  return (
    <main className="max-w-3xl mx-auto px-6 pt-10 pb-24">
      {/* HEADER MINIMALISTA */}
      <header className="mb-16 text-center md:text-left">
        <h1 className="text-5xl md:text-6xl font-cormorant italic text-zinc-900 tracking-tighter mb-3">
          Cuenta
        </h1>
        <div className="h-[1px] w-12 bg-zinc-900 mx-auto md:mx-0 mb-4" />
        <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Ajustes del Santuario</p>
      </header>

      <form onSubmit={updateProfile} className="space-y-20">
        {/* SECCIÓN FOTO: Centrada y Limpia */}
        <section className="flex flex-col items-center justify-center py-4">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm transition-all group-hover:opacity-80">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-200 text-3xl font-cormorant italic">
                  {fullName ? fullName[0] : "O"}
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white border border-zinc-200 p-2 rounded-full cursor-pointer hover:bg-zinc-900 hover:text-white transition-colors shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <input type="file" className="hidden" onChange={uploadAvatar} disabled={updating} />
            </label>
          </div>
        </section>

        {/* CAMPOS DE TEXTO: Estilo Editorial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          <div className="group relative">
            <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-black mb-4 block">Nombre Completo</label>
            <input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-transparent border-b border-zinc-100 py-2 outline-none focus:border-zinc-900 transition-all font-cormorant italic text-2xl text-zinc-800 placeholder:text-zinc-200"
              placeholder="Tu nombre..."
            />
          </div>

          <div className="relative opacity-50">
            <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-black mb-4 block">Correo Electrónico</label>
            <div className="py-2 text-zinc-400 font-light text-sm tracking-wide">
              {profile?.email}
            </div>
            <div className="absolute right-0 bottom-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>

          <div className="md:col-span-2 group relative">
            <label className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-black mb-4 block">Biografía Corta</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={1}
              className="w-full bg-transparent border-b border-zinc-100 py-2 outline-none focus:border-zinc-900 transition-all font-cormorant italic text-xl text-zinc-600 resize-none overflow-hidden"
              placeholder="Escribe tu intención en el yoga..."
            />
          </div>
        </div>

        {/* BOTÓN: Refinado */}
        <div className="pt-10">
          <button 
            type="submit" 
            disabled={updating}
            className="w-full md:w-auto md:px-16 py-5 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.5em] hover:bg-zinc-800 transition-all disabled:opacity-30"
          >
            {updating ? "Guardando..." : "Guardar Perfil"}
          </button>
        </div>
      </form>
    </main>
  )
}
