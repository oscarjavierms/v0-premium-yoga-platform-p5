"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { toast } from "sonner"

interface Props {
  instructorId: string
  currentImageUrl?: string | null
  onImageChange: (url: string) => void
  variant?: "circle" | "cover"
}

export function InstructorAvatarUpload({ instructorId, currentImageUrl, onImageChange, variant = "circle" }: Props) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const toastId = toast.loading(`Subiendo ${variant === "cover" ? "portada" : "perfil"}...`)

    try {
      const formData = new FormData()
      formData.append("file", file)
      // Usamos un sufijo para que no se pisen en el storage
      formData.append("instructorId", variant === "cover" ? `${instructorId}-cover` : instructorId)

      const response = await fetch("/api/upload-instructor-avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      console.log(`URL recibida para ${variant}:`, data.url)
      
      onImageChange(data.url)
      toast.success("Imagen cargada", { id: toastId })
    } catch (error: any) {
      console.error("Error subiendo imagen:", error)
      toast.error("Error al subir", { id: toastId })
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div 
      className={`relative overflow-hidden bg-zinc-100 border-2 border-dashed border-zinc-200 hover:border-black cursor-pointer transition-all ${
        variant === "circle" ? "w-24 h-24 rounded-full mx-auto" : "w-full aspect-[21/9] rounded-xl"
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      {currentImageUrl ? (
        <Image 
          key={currentImageUrl} 
          src={currentImageUrl} 
          alt="Instructor Media" 
          fill 
          className="object-cover"
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
          <Upload className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-bold uppercase">Subir {variant === "cover" ? "Portada" : "Foto"}</span>
        </div>
      )}
      
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full" />
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
