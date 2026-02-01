"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { toast } from "sonner"

interface Props {
  instructorId: string
  currentAvatarUrl?: string | null
  onAvatarChange: (url: string) => void
  variant?: "circle" | "cover"
}

export function InstructorAvatarUpload({ instructorId, currentAvatarUrl, onAvatarChange, variant = "circle" }: Props) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const toastId = toast.loading("Subiendo...")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("instructorId", instructorId)

      const response = await fetch("/api/upload-instructor-avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      // Actualizamos el valor en el formulario inmediatamente
      onAvatarChange(data.url)
      toast.success("Imagen actualizada", { id: toastId })
    } catch (error) {
      toast.error("Error al subir", { id: toastId })
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div 
      className={`relative overflow-hidden bg-zinc-100 border-2 border-dashed border-zinc-200 hover:border-black cursor-pointer transition-all ${
        variant === "circle" ? "w-20 h-20 rounded-full" : "w-full aspect-[21/9] rounded-xl"
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      {currentAvatarUrl ? (
        <Image 
          src={currentAvatarUrl} 
          alt="Preview" 
          fill 
          className="object-cover" 
          priority
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
          <Upload className="w-5 h-5 mb-1" />
          <span className="text-[8px] font-bold uppercase">Subir</span>
        </div>
      )}
      
      {loading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-[10px] font-bold">...</div>}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
