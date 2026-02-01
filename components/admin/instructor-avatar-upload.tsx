"use client"

import { useState } from "react"
import Image from "next/image"
import { toast } from "sonner"
import { Upload, X, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"

interface InstructorAvatarUploadProps {
  instructorId: string
  currentImageUrl?: string | null
  onImageChange: (url: string) => void
  variant?: "circle" | "cover"
}

export function InstructorAvatarUpload({
  instructorId,
  currentImageUrl,
  onImageChange,
  variant = "circle",
}: InstructorAvatarUploadProps) {
  const [loading, setLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const isCircle = variant === "circle"
  const containerClasses = isCircle
    ? "w-24 h-24 rounded-full border-2 border-zinc-200"
    : "w-full h-32 rounded-lg border-2 border-zinc-200"

  const displayImage = previewUrl || currentImageUrl

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validaciones
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona una imagen válida")
      return
    }

    const maxSize = variant === "circle" ? 5 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`La imagen no debe superar ${maxSize / 1024 / 1024}MB`)
      return
    }

    // Crear preview local
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Subir archivo
    await uploadFile(file)
  }

  const uploadFile = async (file: File) => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("instructorId", instructorId)

      // Determinar endpoint según variant
      const endpoint = variant === "circle" 
        ? "/api/upload-instructor-avatar"
        : "/api/upload-instructor-cover"

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || `Error ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.url) {
        throw new Error("No se recibió URL de la imagen")
      }

      // Actualizar con URL final del servidor
      onImageChange(data.url)
      setPreviewUrl(null) // Limpiar preview
      
    } catch (error: any) {
      console.error(`[${variant} Upload Error]`, error)
      toast.error(error.message || `Error al subir ${variant === "circle" ? "foto" : "portada"}`)
      setPreviewUrl(null)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = () => {
    if (currentImageUrl || previewUrl) {
      setPreviewUrl(null)
      onImageChange("")
      toast.success("Imagen eliminada")
    }
  }

  return (
    <div className="relative group">
      {/* Contenedor de imagen */}
      <div
        className={`
          ${containerClasses}
          bg-zinc-100 flex items-center justify-center relative overflow-hidden
          transition-all duration-200
        `}
      >
        {loading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
            <Loader className="w-6 h-6 animate-spin text-white" />
          </div>
        )}

        {displayImage ? (
          <>
            <Image
              src={displayImage}
              alt="Instructor avatar"
              fill
              className="object-cover"
              sizes={isCircle ? "96px" : "100%"}
            />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-400 gap-1">
            <Upload className="w-5 h-5" />
            <span className="text-[10px] text-center px-2">
              {variant === "circle" ? "Foto" : "Portada"}
            </span>
          </div>
        )}

        {/* Overlay con acciones */}
        <div
          className={`
            absolute inset-0 bg-black/50 flex items-center justify-center gap-2
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            ${loading ? "opacity-100" : ""}
          `}
        >
          <label
            htmlFor={`file-input-${instructorId}-${variant}`}
            className="cursor-pointer"
          >
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="bg-white text-black hover:bg-gray-100 h-8"
              asChild
            >
              <span>
                <Upload className="w-3 h-3 mr-1" />
                Cambiar
              </span>
            </Button>
          </label>

          {displayImage && (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={handleRemove}
              disabled={loading}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Input file oculto */}
      <input
        id={`file-input-${instructorId}-${variant}`}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={loading}
        className="hidden"
      />
    </div>
  )
}
