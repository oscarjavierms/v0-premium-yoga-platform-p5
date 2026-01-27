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
    /* AJUSTE DE ESPACIO: pt-4 y -mt-4 para subir el contenido */
    <main className="max-w-4xl mx-auto p-8 pt-4 -mt-4">
      <div className="mb-10">
        <h1 className="text-6xl font-cormorant italic mb-2 tracking-tighter text-zinc-900">
          Mi Perfil
        </h1>
        <p className="text-zinc-400 italic text-sm">
          Personaliza tu espacio y presencia en el santuario.
        </p>
      </div>

      <form onSubmit={updateProfile} className="space-y-12">
        {/* FOTO DE PERFIL */}
        <div className="flex items-center gap-8 bg-zinc-50/50 p-6 border border-zinc-100 rounded-sm">
          <div className="w-24 h-24 bg-white rounded-full overflow-hidden border border-zinc-200 flex items-center justify-center shadow-sm">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-zinc-300 font-cormorant italic">
                {fullName ? fullName[0] : "?"}
              </span>
            )}
          </div>
          <div>
            <label className="inline-block text-[10px] font-bold uppercase tracking-widest mb-2 cursor-pointer bg-zinc-900 text-white px-6 py-3 hover:bg-zinc-800 transition-all rounded-sm">
              Cambiar Foto
              <input type="file" className="hidden" onChange={uploadAvatar} disabled={updating} />
            </label>
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest">
              JPG o PNG. Máximo 1MB.
            </p>
          </div>
        </div>

        {/* DATOS PERSONALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-2 border-b border-zinc-100 pb-2 focus-within:border-zinc-900 transition-colors">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-[0.2em]">Nombre Completo</label>
            <input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full py-1 outline-none bg-transparent text-xl font-cormorant italic text-zinc-800" 
              placeholder="Tu nombre..."
            />
          </div>
          <div className="space-y-2 border-b border-zinc-100 pb-2 opacity-60">
            <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-[0.2em]">Email (Protegido)</label>
            <input 
              value={profile?.email || ""} 
              disabled 
              className="w-full py-1 bg-transparent cursor-not-allowed text-zinc-500" 
            />
          </div>
        </div>

        <div className="space-y-2 border-b border-zinc-100 pb-2 focus-within:border-zinc-900 transition-colors">
          <label className="text-[10px] uppercase text-zinc-400 font-bold tracking-[0.2em]">Sobre mí (Biografía)</label>
          <textarea 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={2} 
            className="w-full py-2 outline-none bg-transparent italic text-zinc-600 resize-none"
            placeholder="Comparte algo sobre tu camino en el yoga..."
          />
        </div>

        <button 
          type="submit" 
          disabled={updating}
          className="w-full bg-zinc-900 text-white py-6 text-[11px] font-bold uppercase tracking-[0.4em] hover:bg-zinc-800 transition-all shadow-xl disabled:opacity-50"
        >
          {updating ? "Sincronizando..." : "ACTUALIZAR PERFIL"}
        </button>
      </form>
    </main>
  )
}
