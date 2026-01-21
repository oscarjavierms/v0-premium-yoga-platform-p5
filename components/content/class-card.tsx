"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Clock, BarChart2, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Class } from "@/types/content"
import { LEVEL_LABELS, PILLAR_LABELS } from "@/types/content"

interface ClassCardProps {
  classData: Class
  showProgress?: boolean
  isFavorite?: boolean
  onToggleFavorite?: () => void
}

export default function ClassCard({
  classData,
  showProgress = false,
  isFavorite = false,
  onToggleFavorite,
}: ClassCardProps) {
  const progress = classData.user_progress?.watch_percentage || 0

  return (
    <article className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-foreground/20 transition-all duration-300">
      {/* Thumbnail */}
      <Link href={`/clase/${classData.slug}`} className="block relative aspect-video overflow-hidden">
        <Image
          src={classData.thumbnail_url || "/placeholder.svg?height=400&width=600&query=yoga class"}
          alt={classData.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded">
          {classData.duration_minutes} min
        </div>

        {/* Free badge */}
        {classData.is_free && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-white text-black text-xs font-semibold uppercase tracking-wider rounded">
            Gratis
          </div>
        )}

        {/* Progress bar */}
        {showProgress && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div className="h-full bg-white transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Pillar tag */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {PILLAR_LABELS[classData.pillar]}
          </span>

          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite()
              }}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
                )}
              />
            </button>
          )}
        </div>

        {/* Title */}
        <Link href={`/clase/${classData.slug}`}>
          <h3 className="font-serif text-lg font-medium mb-2 group-hover:underline underline-offset-4 line-clamp-2">
            {classData.title}
          </h3>
        </Link>

        {/* Instructor */}
        {classData.instructor && <p className="text-sm text-muted-foreground mb-3">con {classData.instructor.name}</p>}

        {/* Meta info */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {classData.duration_minutes} min
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 className="w-3 h-3" />
            {LEVEL_LABELS[classData.level]}
          </span>
        </div>
      </div>
    </article>
  )
}
