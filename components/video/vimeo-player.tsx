"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface VimeoPlayerProps {
  vimeoId: string
  classId: string
  userId?: string
  initialPosition?: number
  onComplete?: () => void
  onProgress?: (progress: { seconds: number; percent: number }) => void
}

export default function VimeoPlayer({
  vimeoId,
  classId,
  userId,
  initialPosition = 0,
  onComplete,
  onProgress,
}: VimeoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const lastSavedTimeRef = useRef(0)
  const isCompletedRef = useRef(false)

  const saveProgress = useCallback(
    async (seconds: number, percent: number, event: string) => {
      if (!userId) return

      const supabase = createClient()
      const isCompleted = percent >= 90

      try {
        await supabase.from("user_progress").upsert(
          {
            user_id: userId,
            class_id: classId,
            watch_position_seconds: Math.floor(seconds),
            watch_percentage: percent,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            last_watched_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,class_id",
          },
        )
      } catch (err) {
        console.error("Error saving progress:", err)
      }
    },
    [userId, classId],
  )

  useEffect(() => {
    if (!containerRef.current || !vimeoId) return

    const loadVimeoPlayer = async () => {
      try {
        // Dynamically import Vimeo player
        const Player = (await import("@vimeo/player")).default

        const player = new Player(containerRef.current!, {
          id: Number.parseInt(vimeoId),
          width: 640,
          responsive: true,
          title: false,
          byline: false,
          portrait: false,
          color: "000000",
        })

        playerRef.current = player

        // Set initial position if resuming
        if (initialPosition > 0) {
          player.setCurrentTime(initialPosition)
        }

        player.on("loaded", () => {
          setIsLoading(false)
        })

        // Track time updates (save every 30 seconds)
        player.on("timeupdate", async (data: { seconds: number; percent: number }) => {
          onProgress?.({ seconds: data.seconds, percent: data.percent * 100 })

          // Save progress every 30 seconds
          if (data.seconds - lastSavedTimeRef.current >= 30) {
            lastSavedTimeRef.current = data.seconds
            await saveProgress(data.seconds, data.percent * 100, "timeupdate")
          }
        })

        // Track video completion
        player.on("ended", async () => {
          if (!isCompletedRef.current) {
            isCompletedRef.current = true
            const duration = await player.getDuration()
            await saveProgress(duration, 100, "ended")
            onComplete?.()
          }
        })

        // Save position on pause
        player.on("pause", async (data: { seconds: number; percent: number }) => {
          await saveProgress(data.seconds, data.percent * 100, "pause")
        })
      } catch (err) {
        console.error("Error loading Vimeo player:", err)
        setError("Error al cargar el video")
        setIsLoading(false)
      }
    }

    loadVimeoPlayer()

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [vimeoId, initialPosition, saveProgress, onComplete, onProgress])

  if (error) {
    return (
      <div className="aspect-video w-full bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
