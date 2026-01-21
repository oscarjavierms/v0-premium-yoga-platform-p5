"use client"

import { useState, useOptimistic } from "react"
import Link from "next/link"
import Image from "next/image"
import { Bookmark, Play } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface FitnessClientProps {
  classes: any[]
  bookmarkedIds: Set<string>
  userId: string
}

export function FitnessClient({ classes, bookmarkedIds, userId }: FitnessClientProps) {
  const [bookmarks, setBookmarks] = useState(bookmarkedIds)
  const [optimisticBookmarks, addOptimisticBookmark] = useOptimistic(
    bookmarks,
    (state, classId: string) => {
      const newSet = new Set(state)
      if (newSet.has(classId)) {
        newSet.delete(classId)
      } else {
        newSet.add(classId)
      }
      return newSet
    }
  )

  const toggleBookmark = async (classId: string) => {
    const supabase = createClient()
    const isBookmarked = optimisticBookmarks.has(classId)

    addOptimisticBookmark(classId)

    if (isBookmarked) {
      await supabase
        .from("user_practice_saved_classes")
        .delete()
        .eq("user_id", userId)
        .eq("class_id", classId)
      
      setBookmarks(prev => {
        const newSet = new Set(prev)
        newSet.delete(classId)
        return newSet
      })
    } else {
      await supabase
        .from("user_practice_saved_classes")
        .insert({ user_id: userId, class_id: classId })
      
      setBookmarks(prev => new Set(prev).add(classId))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 md:px-8 py-12 md:py-16">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4">
            Fitness
          </h1>
          <p className="text-lg text-muted-foreground font-light">
            Fortalece tu cuerpo con movimiento consciente
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((classItem) => (
            <ClassCard
              key={classItem.id}
              classData={classItem}
              isBookmarked={optimisticBookmarks.has(classItem.id)}
              onToggleBookmark={() => toggleBookmark(classItem.id)}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

function ClassCard({ classData, isBookmarked, onToggleBookmark }: any) {
  return (
    <div className="group">
      <Link href={`/clase/${classData.slug}`} className="block">
        <div className="relative aspect-video overflow-hidden bg-muted/50 mb-4">
          <Image
            src={classData.thumbnail_url || "/placeholder.svg?height=400&width=600"}
            alt={classData.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
          
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center">
              <Play className="w-6 h-6 text-foreground ml-1" fill="currentColor" />
            </div>
          </div>

          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {classData.duration_minutes} min
          </div>
        </div>
      </Link>

      <div className="flex items-start justify-between gap-2 mb-2">
        <Link href={`/clase/${classData.slug}`}>
          <h3 className="font-medium text-foreground line-clamp-1 group-hover:underline underline-offset-4">
            {classData.title}
          </h3>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault()
            onToggleBookmark()
          }}
          className="shrink-0"
        >
          <Bookmark
            className={`h-5 w-5 transition-all ${
              isBookmarked ? "fill-foreground text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {classData.instructor && <span>{classData.instructor.name}</span>}
        {classData.difficulty && (
          <>
            <span>·</span>
            <span className="capitalize">{classData.difficulty}</span>
          </>
        )}
      </div>
    </div>
  )
}
