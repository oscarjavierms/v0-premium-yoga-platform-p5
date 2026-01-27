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

  if (loading) return <div className="min-h-screen flex items-center justify-center font-cormorant italic text-zinc-400">Cargando...</div>

  return (
    <main className="max-w-2xl mx-auto px-6 pt-6 pb-12">
      {/* HEADER CON ESPACIO AJUSTADO */}
      <header className="mb-10">
        <h1 className="text-4xl font-cormorant italic text-zinc-900 tracking-tighter mb-3">
          Mi Perfil
        </h1>
        <p className="text-[11px] text-zinc-400 italic tracking-wide leading-relaxed">
          Personaliza tu espacio y presencia en el santuario.
        </p>
      </header>

      <form onSubmit={updateProfile} className="space-y-8">
        {/* SECCIÓN FOTO Y DATOS LADO A LADO */}
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center pb-6 border-b border-zinc-50">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-zinc-200 text-2xl font-cormorant italic">
                  {fullName ? fullName[0] : "O"}
                </div>
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 bg-white border border-zinc-100 p-1.5 rounded-full cursor-pointer hover:bg-zinc-900 hover:text-white transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              <input type="file" className="hidden" onChange={uploadAvatar} disabled={updating} />
            </label>
          </div>

          <div className="flex-1 w-full space-y-4">
            <div className="relative group">
              <label className="text-[8px] uppercase tracking-[0.3em] text-zinc-400 font-black block mb-1 transition-colors group-focus-within:text-zinc-900">Nombre Completo</label>
              <input 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent border-b border-zinc-100 py-1 outline-none focus:border-zinc-900 transition-all font-cormorant italic text-xl text-zinc-800"
                placeholder="Nombre..."
              />
            </div>
            <div className="relative opacity-60">
              <label className="text-[8px] uppercase tracking-[0.3em] text-zinc-400 font-black block mb-1">Email Registrado</label>
              <div className="text-sm text-zinc-500 font-light tracking-tight">{profile?.email}</div>
            </div>
          </div>
        </div>

        {/* BIOGRAFÍA */}
        <div className="relative group">
          <label className="text-[8px] uppercase tracking-[0.3em] text-zinc-400 font-black block mb-2 group-focus-within:text-zinc-900">Biografía</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2}
            className="w-full bg-transparent p-0 outline-none border-b border-zinc-100 focus:border-zinc-900 transition-all font-cormorant italic text-lg text-zinc-600 resize-none overflow-hidden"
            placeholder="Tu intención en la práctica..."
          />
        </div>

        {/* BOTÓN ALINEADO */}
        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={updating}
            className="bg-zinc-900 text-white px-10 py-3.5 text-[9px] font-bold uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all disabled:opacity-30 rounded-sm shadow-sm"
          >
            {updating ? "Sincronizando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </main>
  )
}
