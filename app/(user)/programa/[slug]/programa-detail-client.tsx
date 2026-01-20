"use client"

import { useState } from "react"
import Link from "next/link"
import { Bookmark, BookmarkCheck, Play, Clock, CheckCircle, Heart, ThumbsUp, ThumbsDown, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ClassWithProgress {
  id: string
  title: string
  slug: string
  thumbnail_url: string
  duration_minutes: number
  difficulty: string
  pillar: string
  program_order: number
  instructors: { name: string } | null
  progress: {
    completed: boolean
    progress_seconds: number
  } | null
}

interface ProgramaDetailClientProps {
  program: {
    id: string
    title: string
    slug: string
    description: string
    thumbnail_url: string
    duration_weeks: number
    difficulty: string
    pillar: string
    instructors: {
      id: string
      name: string
      slug: string
      bio: string
      avatar_url: string
    } | null
  }
  classes: ClassWithProgress[]
  userId: string
  initialSaved: boolean
  stats: {
    completedClasses: number
    totalClasses: number
    completionPercentage: number
  }
}

const difficultyLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
}

export function ProgramaDetailClient({
  program,
  classes,
  userId,
  initialSaved,
  stats,
}: ProgramaDetailClientProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [activeTab, setActiveTab] = useState("clases")
  const supabase = createBrowserClient()
  const { toast } = useToast()

  const toggleSave = async () => {
    try {
      if (isSaved) {
        await supabase
          .from("user_practice_saved_programs")
          .delete()
          .eq("user_id", userId)
          .eq("program_id", program.id)
        
        setIsSaved(false)
        toast({ description: "Programa eliminado de guardados" })
      } else {
        await supabase
          .from("user_practice_saved_programs")
          .insert({
            user_id: userId,
            program_id: program.id,
          })
        
        setIsSaved(true)
        toast({ description: "Programa guardado en Mi Práctica" })
      }
    } catch (error) {
      console.error("Error toggling save:", error)
    }
  }

  // Find the next unwatched class
  const nextClass = classes.find(c => !c.progress?.completed) || classes[0]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative">
        <div className="absolute inset-0 h-[50vh] min-h-[400px]">
          <img
            src={program.thumbnail_url || "/placeholder.svg?height=600&width=1200"}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-background" />
        </div>
        <div className="relative h-[50vh] min-h-[400px]" />
      </section>

      {/* Program Info */}
      <section className="px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
            Serie
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl mb-4">{program.title}</h1>
          
          {program.instructors && (
            <Link 
              href={`/instructor/${program.instructors.slug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Instructor: <span className="underline">{program.instructors.name}</span>
            </Link>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pb-6 border-b border-border">
            <div className="flex items-center gap-4">
              <ThumbsUp className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              <ThumbsDown className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
              <span className="text-sm text-muted-foreground">{stats.totalClasses}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={toggleSave}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-5 w-5" />
                  Guardado
                </>
              ) : (
                <>
                  <Bookmark className="h-5 w-5" />
                  Guardar
                </>
              )}
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-8">
              <TabsTrigger 
                value="overview" 
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-foreground",
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "pb-4 px-0 mr-8 text-base uppercase tracking-wider"
                )}
              >
                Información
              </TabsTrigger>
              <TabsTrigger 
                value="clases" 
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-foreground",
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "pb-4 px-0 text-base uppercase tracking-wider"
                )}
              >
                Clases
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <h2 className="font-serif text-2xl mb-4">Sobre este programa</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {program.description}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <Card className="p-4 border-0 bg-secondary/30 text-center">
                      <p className="font-serif text-3xl">{program.duration_weeks}</p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Semanas</p>
                    </Card>
                    <Card className="p-4 border-0 bg-secondary/30 text-center">
                      <p className="font-serif text-3xl">{stats.totalClasses}</p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Clases</p>
                    </Card>
                    <Card className="p-4 border-0 bg-secondary/30 text-center">
                      <p className="font-serif text-3xl">{stats.completionPercentage}%</p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Completado</p>
                    </Card>
                  </div>
                </div>

                {/* Instructor Card */}
                {program.instructors && (
                  <div>
                    <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-4">
                      Instructor
                    </h3>
                    <Link href={`/instructor/${program.instructors.slug}`}>
                      <Card className="p-6 border-0 bg-secondary/30 hover:bg-secondary/50 transition-colors">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted mx-auto mb-4">
                          {program.instructors.avatar_url ? (
                            <img
                              src={program.instructors.avatar_url || "/placeholder.svg"}
                              alt={program.instructors.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <p className="font-medium text-center">{program.instructors.name}</p>
                        {program.instructors.bio && (
                          <p className="text-sm text-muted-foreground text-center mt-2 line-clamp-3">
                            {program.instructors.bio}
                          </p>
                        )}
                      </Card>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Classes Tab */}
            <TabsContent value="clases" className="mt-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-2xl">Clases</h2>
                {nextClass && (
                  <Link href={`/clase/${nextClass.slug}`}>
                    <Button className="rounded-full gap-2">
                      <Play className="h-4 w-4" />
                      {stats.completedClasses > 0 ? "Continuar" : "Comenzar"}
                    </Button>
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((classItem, index) => (
                  <Link key={classItem.id} href={`/clase/${classItem.slug}`}>
                    <Card className="overflow-hidden border-0 bg-transparent group relative">
                      {/* Class Number */}
                      <span className="absolute top-4 left-4 z-10 text-sm font-medium text-white bg-black/60 w-7 h-7 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>

                      {/* Completed Check */}
                      {classItem.progress?.completed && (
                        <div className="absolute top-4 right-4 z-10">
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        </div>
                      )}

                      {/* Save Button */}
                      <button
                        type="button"
                        className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault()
                          // Toggle save functionality would go here
                        }}
                      >
                        <Heart className="h-5 w-5 text-white drop-shadow-md" />
                      </button>

                      <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                        <img
                          src={classItem.thumbnail_url || "/placeholder.svg?height=180&width=320"}
                          alt={classItem.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          {classItem.duration_minutes}:{String(0).padStart(2, "0")}
                        </div>

                        {/* Progress bar */}
                        {classItem.progress && !classItem.progress.completed && classItem.progress.progress_seconds > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
                            <div 
                              className="h-full bg-white"
                              style={{ 
                                width: `${Math.min(100, (classItem.progress.progress_seconds / (classItem.duration_minutes * 60)) * 100)}%` 
                              }}
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-medium mb-1 line-clamp-1">{classItem.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {classItem.instructors && (
                            <span>{classItem.instructors.name}</span>
                          )}
                          <span>•</span>
                          <span>{difficultyLabels[classItem.difficulty] || classItem.difficulty}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
