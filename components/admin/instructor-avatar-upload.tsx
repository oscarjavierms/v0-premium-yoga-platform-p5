"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface InstructorAvatarUploadProps {
  instructorId: string
  currentAvatarUrl?: string | null
  onAvatarChange: (url: string) => void
  variant?: "circle" | "cover"
}

export function InstructorAvatarUpload({
  instructorId,
  currentAvatarUrl,
  onAvatarChange,
  variant = "circle",
}: InstructorAvatarUploadProps) {
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen")
      return
    }

    setLoading(true)
    const toastId = toast.loading("Subiendo imagen...")

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("instructorId", instructorId)

      const response = await fetch("/api/upload-instructor-avatar", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Error al subir")

      // IMPORTANTE: Esto le dice al formulario que la URL cambió
      onAvatarChange(data.url)
      toast.success("Imagen cargada con éxito", { id: toastId })
    } catch (error: any) {
      toast.error(error.message, { id: toastId })
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-2 w-full">
      <div 
        onClick={() => !loading && fileInputRef.current?.click()}
        className={`relative cursor-pointer overflow-hidden bg-zinc-100 border-2 border-dashed border-zinc-300 hover:border-zinc-800 transition-all ${
          variant === "circle" ? "w-32 h-32 rounded-full mx-auto" : "w-full aspect-[21/9] rounded-xl"
        }`}
      >
        {currentAvatarUrl ? (
          <Image
            src={currentAvatarUrl}
            alt="Upload"
            fill
            className="object-cover"
            unoptimized // Evita problemas de caché de Next.js
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400">
            <Upload className="w-6 h-6 mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Subir Foto</span>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">
            Cargando...
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
