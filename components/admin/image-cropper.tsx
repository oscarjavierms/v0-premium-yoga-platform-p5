"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { X, ZoomIn, RotateCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ImageCropperProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageSrc: string
  onCropComplete: (croppedImage: Blob) => void
}

export function ImageCropper({ open, onOpenChange, imageSrc, onCropComplete }: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isLoading, setIsLoading] = useState(false)

  const CIRCLE_SIZE = 300
  const CONTAINER_SIZE = 400

  // Dibujar preview del crop
  useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imageRef.current

    // Limpiar canvas
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"
    ctx.fillRect(0, 0, CONTAINER_SIZE, CONTAINER_SIZE)

    // Guardar estado del canvas
    ctx.save()

    // Trasladar al centro del contenedor
    ctx.translate(CONTAINER_SIZE / 2, CONTAINER_SIZE / 2)

    // Aplicar rotación
    ctx.rotate((rotation * Math.PI) / 180)

    // Dibujar imagen con pan y zoom
    const scaledWidth = img.width * zoom
    const scaledHeight = img.height * zoom
    ctx.drawImage(
      img,
      -scaledWidth / 2 + pan.x,
      -scaledHeight / 2 + pan.y,
      scaledWidth,
      scaledHeight
    )

    ctx.restore()

    // Dibujar círculo de corte
    ctx.strokeStyle = "white"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(CONTAINER_SIZE / 2, CONTAINER_SIZE / 2, CIRCLE_SIZE / 2, 0, Math.PI * 2)
    ctx.stroke()

    // Oscurecer fuera del círculo
    ctx.globalCompositeOperation = "destination-in"
    ctx.fillStyle = "white"
    ctx.beginPath()
    ctx.arc(CONTAINER_SIZE / 2, CONTAINER_SIZE / 2, CIRCLE_SIZE / 2, 0, Math.PI * 2)
    ctx.fill()
  }, [zoom, pan, rotation, imageSrc])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStart.x
    const deltaY = e.clientY - dragStart.y

    setPan((prev) => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY,
    }))

    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0])
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleCropComplete = async () => {
    if (!canvasRef.current) return

    setIsLoading(true)

    try {
      // Crear canvas limpio para la imagen final
      const finalCanvas = document.createElement("canvas")
      finalCanvas.width = CIRCLE_SIZE
      finalCanvas.height = CIRCLE_SIZE
      const finalCtx = finalCanvas.getContext("2d")

      if (!finalCtx || !imageRef.current) return

      const img = imageRef.current

      // Dibujar imagen rotada y con pan/zoom
      finalCtx.save()
      finalCtx.translate(CIRCLE_SIZE / 2, CIRCLE_SIZE / 2)
      finalCtx.rotate((rotation * Math.PI) / 180)

      const scaledWidth = img.width * zoom
      const scaledHeight = img.height * zoom
      finalCtx.drawImage(
        img,
        -scaledWidth / 2 + pan.x,
        -scaledHeight / 2 + pan.y,
        scaledWidth,
        scaledHeight
      )

      finalCtx.restore()

      // Aplicar máscara circular
      finalCtx.globalCompositeOperation = "destination-in"
      finalCtx.fillStyle = "white"
      finalCtx.beginPath()
      finalCtx.arc(CIRCLE_SIZE / 2, CIRCLE_SIZE / 2, CIRCLE_SIZE / 2, 0, Math.PI * 2)
      finalCtx.fill()

      // Convertir a blob
      finalCanvas.toBlob((blob) => {
        if (blob) {
          onCropComplete(blob)
          onOpenChange(false)
          setZoom(1)
          setPan({ x: 0, y: 0 })
          setRotation(0)
        }
        setIsLoading(false)
      }, "image/jpeg", 0.95)
    } catch (error) {
      console.error("[ImageCropper] Error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustar Foto</DialogTitle>
          <DialogDescription>
            Mueve, amplía y rota la foto para que se vea perfecta
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Canvas con preview */}
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={CONTAINER_SIZE}
              height={CONTAINER_SIZE}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="border-2 border-border rounded-lg cursor-move bg-black"
            />
            <img
              ref={imageRef}
              src={imageSrc}
              alt="crop"
              className="hidden"
            />
          </div>

          {/* Zoom slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Zoom: {zoom.toFixed(2)}x
            </label>
            <Slider
              value={[zoom]}
              onValueChange={handleZoomChange}
              min={0.5}
              max={3}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Botones de control */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleRotate}
              className="flex-1 gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Rotar 90°
            </Button>
          </div>

          {/* Instrucciones */}
          <p className="text-xs text-muted-foreground text-center">
            Arrastra la foto para mover · Usa el zoom para ampliar · Rota si necesitas
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleCropComplete}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? "Procesando..." : "Guardar Foto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
