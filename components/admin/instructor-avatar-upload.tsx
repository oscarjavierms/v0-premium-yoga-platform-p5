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

    setLoading(true)

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
      toast.success("Foto subida correctamente")
      onAvatarChange(result.data)
    }

    setLoading(false)
    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Foto del Instructor</label>

      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-medium text-muted-foreground">
              {currentAvatarUrl ? "?" : "+"}
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
            {loading ? "Subiendo..." : "Seleccionar foto"}
          </Button>

          {preview && (
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
              Eliminar
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
