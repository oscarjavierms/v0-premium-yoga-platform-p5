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

  // Estados del formulario
  const [fullName, setFullName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [bio, setBio] = useState("")

  useEffect(() => {
    getProfile()
  }, [])

  async function getProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return router.push("/login")

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (data) {
        setProfile(data)
        setFullName(data.full_name || "")
        setAvatarUrl(data.avatar_url || "")
        setBio(data.bio || "")
      }
    } catch (error) {
      console.error("Error cargando perfil:", error)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault()
    setUpdating(true)

    const { data: { user } } = await supabase.auth.getUser()

    const updates = {
      id: user?.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      bio: bio,
      updated_at: new Date(),
    }

    const { error } = await supabase.from("profiles").upsert(updates)

    if (error) alert("Error al actualizar: " + error.message)
    else alert("¡Perfil actualizado con éxito!")
    
    setUpdating(false)
  }

  async function uploadAvatar(event: any) {
    try {
      setUpdating(true)
      if (!event.target.files || event.target.files.length === 0) return

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
      setAvatarUrl(publicUrl)
      
    } catch (error: any) {
      alert("Error subiendo imagen: " + error.message)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <div className="p-20 text-center font-cormorant italic">Cargando tu santuario...</div>

  return (
    <main className="max-w-4xl mx-auto p-8 pt-20">
      <h1 className="text-6xl font-cormorant italic mb-2">Mi Perfil</h1>
      <p className="text-zinc-400 mb-12 italic">Personaliza tu espacio y presencia en el santuario.</p>

      <form onSubmit={updateProfile} className="space-y-12">
        {/* FOTO DE PERFIL */}
        <div className="flex items-center gap-8">
          <div className="w-32 h-32 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-4xl text-zinc-300 font-cormorant italic">{fullName[0]}</span>
            )}
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 cursor-pointer bg-zinc-900 text-white px-4 py-2 hover:bg-zinc-700 transition-colors">
              Cambiar Foto
              <input type="file" className="hidden" onChange={uploadAvatar} disabled={updating} />
            </label>
            <p className="text-[10px] text-zinc-400 uppercase tracking-tighter">JPG o PNG. Máximo 1MB.</p>
          </div>
        </div>

        {/* DATOS PERSONALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Nombre Completo</label>
            <input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900 transition-colors bg-transparent" 
              placeholder="Tu nombre"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Email (No editable)</label>
            <input 
              value={profile?.email || ""} 
              disabled 
              className="w-full border-b border-zinc-100 py-2 text-zinc-300 bg-transparent cursor-not-allowed" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">Sobre mí (Biografía)</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3} 
            className="w-full border-b border-zinc-100 py-2 outline-none focus:border-zinc-900 bg-transparent italic"
            placeholder="Buscando el equilibrio entre el éxito y la paz interior..."
          />
        </div>

        <button 
          type="submit" 
          disabled={updating}
          className="w-full bg-zinc-900 text-white py-6 text-[12px] font-bold uppercase tracking-[0.5em] hover:bg-zinc-800 transition-all"
        >
          {updating ? "Guardando..." : "ACTUALIZAR PERFIL"}
        </button>
      </form>
    </main>
  )
}
