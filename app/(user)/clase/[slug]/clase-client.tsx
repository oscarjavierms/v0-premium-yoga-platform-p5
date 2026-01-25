"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft, Bookmark, BookmarkCheck, Play, Clock, User, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface ClaseClientProps {
  classData: {
    id: string
    title: string
    slug: string
    description: string
    thumbnail_url: string
    vimeo_id: string
    duration_minutes: number
    difficulty: string
    pillar: string
    instructors: {
      id: string
      name: string
      slug: string
      bio: string
      avatar_url: string
    } | null
    programs: {
      id: string
      title: string
      slug: string
    } | null
  }
  userId: string
  initialProgress: {
    id: string
    progress_seconds: number
    completed: boolean
  } | null
  initialSaved: boolean
  relatedClasses: Array<{
    id: string
    title: string
    slug: string
    thumbnail_url: string
    duration_minutes: number
    pillar: string
    instructors: { name: string } | null
  }>
}

export function ClaseClient({
  classData,
  userId,
  initialProgress,
  initialSaved,
  relatedClasses,
}: ClaseClientProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(initialProgress?.progress_seconds || 0)
  const [duration, setDuration] = useState(classData.duration_minutes * 60)
  const [isCompleted, setIsCompleted] = useState(initialProgress?.completed || false)
  const playerRef = useRef<any>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createBrowserClient()
  const { toast } = useToast()

  // Initialize Vimeo Player
  useEffect(() => {
    if (!classData.vimeo_id) return

    const loadVimeoPlayer = async () => {
      const VimeoPlayer = (await import("@vimeo/player")).default
      
      const iframe = document.getElementById("vimeo-player") as HTMLIFrameElement
      if (!iframe) return

      const player = new VimeoPlayer(iframe)
      playerRef.current = player

      // Get video duration
      player.getDuration().then((dur: number) => {
        setDuration(dur)
      })

      // Set initial time if resuming
      if (initialProgress?.progress_seconds && initialProgress.progress_seconds > 0) {
        player.setCurrentTime(initialProgress.progress_seconds)
      }

      // Track play state
      player.on("play", () => {
        setIsPlaying(true)
        startProgressTracking()
      })

      player.on("pause", () => {
        setIsPlaying(false)
        stopProgressTracking()
        saveProgress()
      })

      player.on("ended", () => {
        setIsPlaying(false)
        stopProgressTracking()
        markAsCompleted()
      })

      player.on("timeupdate", (data: { seconds: number }) => {
        setCurrentTime(data.seconds)
        
        // Auto-complete at 90%
        if (!isCompleted && data.seconds >= duration * 0.9) {
          markAsCompleted()
        }
      })
    }

    loadVimeoPlayer()

    return () => {
      stopProgressTracking()
    }
  }, [classData.vimeo_id])

  const startProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) return
    
    progressIntervalRef.current = setInterval(() => {
      saveProgress()
    }, 30000) // Save every 30 seconds
  }, [])

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
  }, [])

  const saveProgress = async () => {
    if (!playerRef.current) return
    
    try {
      const time = await playerRef.current.getCurrentTime()
      
      await supabase
        .from("user_progress")
        .upsert({
          user_id: userId,
          class_id: classData.id,
          progress_seconds: Math.round(time),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,class_id"
        })
    } catch (error) {
      console.error("Error saving progress:", error)
    }
  }

  const markAsCompleted = async () => {
    if (isCompleted) return
    
    try {
      await supabase
        .from("user_progress")
        .upsert({
          user_id: userId,
          class_id: classData.id,
          progress_seconds: Math.round(duration),
          completed: true,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,class_id"
        })

      setIsCompleted(true)
      toast({
        title: "Clase completada",
        description: "Has sumado minutos a tu práctica.",
      })
    } catch (error) {
      console.error("Error marking as completed:", error)
    }
  }

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await supabase
          .from("user_practice_saved_classes")
          .delete()
          .eq("user_id", userId)
          .eq("class_id", classData.id)
        
        setIsSaved(false)
        toast({ description: "Clase eliminada de guardados" })
      } else {
        await supabase
          .from("user_practice_saved_classes")
          .insert({
            user_id: userId,
            class_id: classData.id,
          })
        
        setIsSaved(true)
        toast({ description: "Clase guardada en Mi Práctica" })
      }
    } catch (error) {
      console.error("Error toggling save:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Video Player Section */}
      <section className="bg-black py-6">
        <div className="max-w-6xl mx-auto px-4">
          {classData.vimeo_id ? (
            <iframe
              id="vimeo-player"
              src={`https://player.vimeo.com/video/${classData.vimeo_id}?title=0&byline=0&portrait=0&color=000000`}
              className="w-full aspect-video rounded-lg border border-border shadow-sm"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center bg-muted rounded-lg border border-border">
              <p className="text-muted-foreground">Video no disponible</p>
            </div>
          )}
        </div>
      </section>

      {/* Class Info */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/mi-santuario" className="hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span>/</span>
            {classData.programs && (
              <>
                <Link 
                  href={`/programa/${classData.programs.slug}`}
                  className="hover:text-foreground transition-colors"
                >
                  {classData.programs.title}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground">{classData.title}</span>
          </div>

          {/* Title and Meta */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {classData.pillar} • {classData.difficulty}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl mb-2">{classData.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {classData.duration_minutes} min
                </span>
                {isCompleted && (
                  <span className="text-green-600 font-medium">Completada</span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 gap-2 rounded-full bg-transparent"
              onClick={toggleSave}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4" />
                  Guardada
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4" />
                  Guardar
                </>
              )}
            </Button>
          </div>

          {/* Description */}
          {classData.description && (
            <p className="text-muted-foreground leading-relaxed mb-8">
              {classData.description}
            </p>
          )}

          {/* Instructor */}
          {classData.instructors && (
            <Link href={`/instructor/${classData.instructors.slug}`}>
              <Card className="p-4 border-0 bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-muted shrink-0">
                    {classData.instructors.avatar_url ? (
                      <img
                        src={classData.instructors.avatar_url || "/placeholder.svg"}
                        alt={classData.instructors.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      Instructor
                    </p>
                    <p className="font-medium">{classData.instructors.name}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            </Link>
          )}
        </div>
      </section>

      {/* Related Classes */}
      {relatedClasses.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-8 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-2xl mb-6">Clases Relacionadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedClasses.map((related) => (
                <Link key={related.id} href={`/clase/${related.slug}`}>
                  <Card className="overflow-hidden border-0 bg-transparent group">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={related.thumbnail_url || "/placeholder.svg?height=180&width=320"}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-4 w-4 text-black ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {related.duration_minutes} min
                      </div>
                    </div>
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                      {related.pillar}
                    </p>
                    <h3 className="text-sm font-medium line-clamp-2">{related.title}</h3>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
