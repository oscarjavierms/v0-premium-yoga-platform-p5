"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { uploadInstructorAvatar } from "@/lib/actions/instructors"

interface InstructorAvatarUploadProps {
  instructorId: string
  currentAvatarUrl?: string | null
  onAvatarChange: (url: string) => void
}

export function InstructorAvatarUpload({
  instructorId,
  currentAvatarUrl,
  onAvatarChange,
}: InstructorAvatarUploadProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("El archivo debe ser una imagen")
      return
    }

    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe superar 5MB")
      return
    }

    setLoading(true)

    try {
      // Mostrar preview local inmediatamente
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Subir a Storage
      const result = await uploadInstructorAvatar(file, instructorId)

      if (result.error) {
        toast.error(result.error)
        setPreview(currentAvatarUrl || null)
      } else {
        toast.success("Foto actualizada correctamente")
        onAvatarChange(result.data)
      }
    } catch (error) {
      console.error("[Avatar Upload] Error:", error)
      toast.error("Error al procesar la foto")
      setPreview(currentAvatarUrl || null)
    } finally {
      setLoading(false)
      // Limpiar input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Foto del Instructor</label>

      <div className="flex items-center gap-6">
        {/* Preview circular GRANDE */}
        <div className="relative w-32 h-32 rounded-full overflow-hidden bg-muted flex-shrink-0 border-2 border-border shadow-sm">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-medium text-muted-foreground">
              +
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-2">
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
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            {loading ? "Subiendo..." : "Cambiar foto"}
          </Button>

          {preview && currentAvatarUrl && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPreview(null)
                onAvatarChange("")
              }}
              disabled={loading}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
              Eliminar foto
            </Button>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        JPG, PNG o GIF. Máximo 5MB.
      </p>
    </div>
  )
}
