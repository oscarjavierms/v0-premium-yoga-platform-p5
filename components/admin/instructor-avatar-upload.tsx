"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface Props {
  instructorId: string
  currentImageUrl?: string | null
  onImageChange: (url: string) => void
  variant?: "circle" | "cover"
}

export function InstructorAvatarUpload({ 
  instructorId, 
  currentImageUrl, 
  onImageChange, 
  variant = "circle" 
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validaciones del lado del cliente
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida")
      return
    }

    const maxSize = variant === "cover" ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`La imagen no debe superar ${maxSize / 1024 / 1024}MB`)
      return
    }

    setLoading(true)
    setError(null)
    const toastId = toast.loading(`Subiendo ${variant === "cover" ? "portada" : "foto"}...`)

    try {
      const formData = new FormData()
      formData.append("file", file)
      // Agregar sufijo para que no se pisen en el storage
      formData.append("instructorId", variant === "cover" ? `${instructorId}-cover` : instructorId)

      const endpoint = variant === "cover" 
        ? "/api/upload-instructor-cover"
        : "/api/upload-instructor-avatar"

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.error || `Error ${response.status}`
        throw new Error(errorMsg)
      }

      if (!data.url) {
        throw new Error("No se recibió URL de la imagen")
      }

      console.log(`✅ ${variant} actualizado:`, data.url)
      
      onImageChange(data.url)
      toast.success(
        variant === "cover" ? "Portada actualizada" : "Foto actualizada", 
        { id: toastId }
      )
      setError(null)

    } catch (error: any) {
      const errorMsg = error.message || "Error al subir imagen"
      console.error(`❌ Error subiendo ${variant}:`, error)
      setError(errorMsg)
      toast.error(errorMsg, { id: toastId })
    } finally {
      setLoading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    if (!loading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div 
      className={`relative overflow-hidden bg-zinc-100 border-2 border-dashed border-zinc-200 hover:border-black cursor-pointer transition-all ${
        loading ? "opacity-60" : ""
      } ${
        variant === "circle" ? "w-24 h-24 rounded-full mx-auto" : "w-full aspect-[21/9] rounded-xl"
      }`}
      onClick={handleClick}
    >
      {currentImageUrl ? (
        <>
          <Image 
            key={currentImageUrl} 
            src={currentImageUrl} 
            alt={variant === "cover" ? "Portada del instructor" : "Foto de perfil"} 
            fill 
            className="object-cover"
            unoptimized
            priority={false}
          />
          {/* Overlay semi-transparente al hover */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
            <Upload className="w-5 h-5 text-white" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 gap-1">
          <Upload className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase text-center px-2">
            {variant === "cover" ? "Subir Portada" : "Subir Foto"}
          </span>
          {variant === "cover" && (
            <span className="text-[8px] text-zinc-500">Proporción 21:9</span>
          )}
        </div>
      )}
      
      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full" />
            <span className="text-xs font-medium">Subiendo...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="absolute inset-0 bg-red-50/90 flex items-center justify-center p-2">
          <div className="flex flex-col items-center gap-1 text-center">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-[10px] text-red-700 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Input file oculto */}
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleFileSelect} 
        disabled={loading}
        className="hidden" 
      />
    </div>
  )
}
