"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface InstructorCoverUploadProps {
  instructorId: string
  currentCoverUrl?: string | null
  onCoverChange: (url: string) => void
}

export function InstructorCoverUpload({
  instructorId,
  currentCoverUrl,
  onCoverChange,
}: InstructorCoverUploadProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentCoverUrl || null)
  const [localPreview, setLocalPreview] = useState<string | null>(null)
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
      // Mostrar preview local INMEDIATAMENTE
      const reader = new FileReader()
      reader.onload = (event) => {
        const previewUrl = event.target?.result as string
        setLocalPreview(previewUrl)
        setPreview(previewUrl)
      }
      reader.readAsDataURL(file)

      // Crear FormData
      const formData = new FormData()
      formData.append("file", file)
      formData.append("instructorId", instructorId)

      // Llamar a la API
      const response = await fetch("/api/upload-instructor-cover", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || "Error al subir la foto")
        // Volver a preview anterior
        setPreview(currentCoverUrl || null)
        setLocalPreview(null)
        return
      }

      // ✅ GUARDAR URL DEFINITIVA
      toast.success("Foto de portada subida correctamente")
      setPreview(data.url)
      setLocalPreview(null)
      onCoverChange(data.url)
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al procesar la foto")
      setPreview(currentCoverUrl || null)
      setLocalPreview(null)
    } finally {
      setLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Foto de Portada</label>

      <div className="space-y-3">
        {/* Preview horizontal */}
        <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted border-2 border-border">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              priority
              unoptimized={Boolean(localPreview)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-lg font-medium text-muted-foreground">
              Sin portada
            </div>
          )}
          
          {/* Indicador de carga */}
          {loading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="animate-spin">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-2">
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
            {loading ? "Subiendo..." : "Cambiar portada"}
          </Button>

          {preview && preview !== currentCoverUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPreview(currentCoverUrl || null)
                setLocalPreview(null)
                onCoverChange(currentCoverUrl || "")
              }}
              disabled={loading}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Estado */}
        <div className="text-xs text-muted-foreground">
          {loading && "📤 Subiendo..."}
          {preview && !loading && "✅ Foto cargada (click en Actualizar para guardar)"}
          {!preview && !loading && "sin portada"}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        JPG, PNG o GIF. Máximo 10MB. Aspecto 16:9 recomendado.
      </p>
    </div>
  )
}
