"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

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
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no debe superar 10MB")
      return
    }

    setLoading(true)

    try {
      // Mostrar preview local
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Crear FormData
      const formData = new FormData()
      formData.append("file", file)
      formData.append("instructorId", instructorId)
      formData.append("variant", variant)

      // Llamar a la API correspondiente
      const endpoint = variant === "cover" 
        ? "/api/upload-instructor-cover" 
        : "/api/upload-instructor-avatar"

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al subir la foto")
        setPreview(currentImageUrl || null)
        return
      }

      toast.success(
        variant === "cover" 
          ? "Foto de portada actualizada correctamente" 
          : "Foto de perfil actualizada correctamente"
      )
      setPreview(data.url)
      onImageChange(data.url)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al procesar la foto")
      setPreview(currentImageUrl || null)
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const isCover = variant === "cover"

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {/* Preview */}
        {isCover ? (
          // COVER - Rectangular
          <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted border-2 border-border">
            {preview ? (
              <Image
                src={preview}
                alt="Cover Preview"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-medium text-muted-foreground">
                Sin portada
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="animate-spin">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
          </div>
        ) : (
          // AVATAR - Circular
          <div className="relative w-28 h-28 rounded-full overflow-hidden bg-muted border-2 border-border mx-auto">
            {preview ? (
              <Image
                src={preview}
                alt="Avatar Preview"
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-medium text-muted-foreground">
                Sin foto
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="animate-spin">
                  <Upload className="w-4 h-4 text-white" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-2 justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={loading}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="gap-2 flex-1"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Subiendo..." : isCover ? "Cambiar portada" : "Cambiar foto"}
          </Button>

          {preview && preview !== currentImageUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPreview(currentImageUrl || null)
                onImageChange(currentImageUrl || "")
              }}
              disabled={loading}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Estado */}
        <div className="text-xs text-muted-foreground text-center">
          {loading && "📤 Subiendo..."}
          {preview && !loading && "✅ Foto cargada"}
          {!preview && !loading && "Sin imagen"}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        JPG, PNG o GIF. Máximo 10MB.
        {isCover && " Aspecto 21:9 recomendado."}
      </p>
    </div>
  )
}
