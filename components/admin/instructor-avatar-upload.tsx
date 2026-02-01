"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface InstructorAvatarUploadProps {
  instructorId: string
  currentAvatarUrl?: string | null
  onAvatarChange: (url: string) => void
  variant?: "circle" | "cover" // Agregamos variante
}

export function InstructorAvatarUpload({
  instructorId,
  currentAvatarUrl,
  onAvatarChange,
  variant = "circle"
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

    // ELIMINADO: Límite de 5MB (ahora depende de tu servidor/Supabase)
    setLoading(true)
    const toastId = toast.loading("Subiendo imagen de alta calidad...")

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

      toast.success("Imagen actualizada", { id: toastId })
      onAvatarChange(data.url) // Esto actualiza el formulario de inmediato
    } catch (error: any) {
      toast.error(error.message || "Error al subir", { id: toastId })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3 w-full">
      <div className={`relative overflow-hidden bg-muted border-2 border-dashed border-zinc-300 hover:border-black transition-all ${
        variant === "circle" ? "w-32 h-32 rounded-full mx-auto" : "w-full aspect-[21/9] rounded-xl"
      }`}>
        {currentAvatarUrl ? (
          <Image src={currentAvatarUrl} alt="Preview" fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
            <ImageIcon className="w-8 h-8 opacity-20" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Sin imagen</span>
          </div>
        )}
        
        {/* Overlay de carga */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
        >
          <span className="text-white text-[10px] font-bold uppercase tracking-widest">
            {loading ? "Subiendo..." : "Cambiar Foto"}
          </span>
        </div>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
