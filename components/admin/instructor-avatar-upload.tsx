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

  // ✅ NUEVO: Procesar imagen en el cliente
  const processImageToCircle = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const img = new Image()

        img.onload = () => {
          const CIRCLE_SIZE = 400

          // Crear canvas
          const canvas = document.createElement("canvas")
          canvas.width = CIRCLE_SIZE
          canvas.height = CIRCLE_SIZE

          const ctx = canvas.getContext("2d")
          if (!ctx) {
            reject(new Error("No se pudo obtener contexto del canvas"))
            return
          }

          // Limpiar canvas
          ctx.clearRect(0, 0, CIRCLE_SIZE, CIRCLE_SIZE)

          // Calcular escala
          const scale = Math.max(CIRCLE_SIZE / img.width, CIRCLE_SIZE / img.height)
          const scaledWidth = img.width * scale
          const scaledHeight = img.height * scale
          const x = (CIRCLE_SIZE - scaledWidth) / 2
          const y = (CIRCLE_SIZE - scaledHeight) / 2

          // Dibujar imagen
          ctx.drawImage(img, x, y, scaledWidth, scaledHeight)

          // Aplicar máscara circular
          ctx.globalCompositeOperation = "destination-in"
          ctx.fillStyle = "white"
          ctx.beginPath()
          ctx.arc(CIRCLE_SIZE / 2, CIRCLE_SIZE / 2, CIRCLE_SIZE / 2, 0, Math.PI * 2)
          ctx.fill()

          // Convertir a blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob)
              } else {
                reject(new Error("No se pudo crear el blob"))
              }
            },
            "image/jpeg",
            0.95
          )
        }

        img.onerror = () => {
          reject(new Error("No se pudo cargar la imagen"))
        }

        img.src = event.target?.result as string
      }

      reader.onerror = () => {
        reject(new Error("No se pudo leer el archivo"))
      }

      reader.readAsDataURL(file)
    })
  }

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

      // ✅ NUEVO: Procesar imagen en cliente
      const processedBlob = await processImageToCircle(file)
      const processedFile = new File([processedBlob], "avatar.jpg", { type: "image/jpeg" })

      // Subir a Storage
      const result = await uploadInstructorAvatar(processedFile, instructorId)

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
        JPG, PNG o GIF. Máximo 5MB. Se recorta automáticamente en formato circular.
      </p>
    </div>
  )
}
