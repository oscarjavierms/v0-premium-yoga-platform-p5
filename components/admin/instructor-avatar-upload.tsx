"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { uploadInstructorAvatar } from "@/lib/actions/instructors"
import { ImageCropper } from "./image-cropper"

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
  const [cropperOpen, setCropperOpen] = useState(false)
  const [imageToCrop, setImageToCrop] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Leer archivo y abrir cropper
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageSrc = event.target?.result as string
      setImageToCrop(imageSrc)
      setCropperOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setLoading(true)

    try {
      // Mostrar preview local inmediatamente
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreview(event.target?.result as string)
      }
      reader.readAsDataURL(croppedBlob)

      // Crear File del blob para upload
      const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" })

      // Subir a Storage
      const result = await uploadInstructorAvatar(croppedFile, instructorId)

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
    <>
      <div className="space-y-3">
        <label className="block text-sm font-medium">Foto del Instructor</label>

        <div className="flex items-center gap-4">
          {/* Preview circular */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
            {preview ? (
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-medium text-muted-foreground">
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
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="gap-2 bg-transparent"
            >
              <Upload className="w-4 h-4" />
              {loading ? "Procesando..." : "Cambiar foto"}
            </Button>

            {preview && preview !== currentAvatarUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPreview(currentAvatarUrl || null)
                  onAvatarChange(currentAvatarUrl || "")
                }}
                disabled={loading}
                className="gap-2 bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
                Descartar cambios
              </Button>
            )}

            {preview && currentAvatarUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setPreview(null)
                  onAvatarChange("")
                }}
                disabled={loading}
                className="gap-2 bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
                Eliminar foto
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          JPG, PNG o GIF. Máximo 5MB. Se mostrará en formato circular.
        </p>
      </div>

      {/* Image Cropper Modal */}
      <ImageCropper
        open={cropperOpen}
        onOpenChange={setCropperOpen}
        imageSrc={imageToCrop}
        onCropComplete={handleCropComplete}
      />
    </>
  )
}
