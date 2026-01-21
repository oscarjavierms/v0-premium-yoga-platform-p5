"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, Bookmark, Clock, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ClassItem {
  id: string
  title: string
  slug: string
  thumbnail_url: string
  duration_minutes: number
  difficulty: string
  pillar: string
  instructors: { name: string } | null
}

interface MiPracticaClientProps {
  savedClasses: Array<ClassItem & { savedAt: string }>
  savedPrograms: Array<{
    id: string
    title: string
    slug: string
    thumbnail_url: string
    duration_weeks: number
    difficulty: string
    pillar: string
    instructors: { name: string } | null
    savedAt: string
  }>
  history: Array<ClassItem & { completedAt: string; watchedMinutes: number }>
}

export function MiPracticaClient({
  savedClasses,
  savedPrograms,
  history,
}: MiPracticaClientProps) {
  const [activeTab, setActiveTab] = useState("guardados")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight">
            Mi Práctica
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Tu biblioteca personal de clases y programas guardados.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-8">
              <TabsTrigger 
                value="guardados" 
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-foreground",
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "pb-4 px-0 mr-8 text-base"
                )}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Guardados ({savedClasses.length + savedPrograms.length})
              </TabsTrigger>
              <TabsTrigger 
                value="historial" 
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-foreground",
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "pb-4 px-0 text-base"
                )}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Historial ({history.length})
              </TabsTrigger>
            </TabsList>

            {/* Guardados Tab */}
            <TabsContent value="guardados" className="mt-0">
              {savedClasses.length === 0 && savedPrograms.length === 0 ? (
                <div className="text-center py-20">
                  <Bookmark className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-serif text-xl mb-2">Aún no tienes guardados</h3>
                  <p className="text-muted-foreground mb-6">
                    Guarda clases y programas para acceder a ellos fácilmente.
                  </p>
                  <Link 
                    href="/explorar" 
                    className="text-sm underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    Explorar clases
                  </Link>
                </div>
              ) : (
                <div className="space-y-12">
                  {/* Saved Programs */}
                  {savedPrograms.length > 0 && (
                    <div>
                      <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
                        Programas
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedPrograms.map((program) => (
                          <Link key={program.id} href={`/programa/${program.slug}`}>
                            <Card className="overflow-hidden border-0 bg-transparent group">
                              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                <img
                                  src={program.thumbnail_url || "/placeholder.svg?height=200&width=320"}
                                  alt={program.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                  {program.duration_weeks} semanas
                                </div>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                                  Programa • {program.pillar}
                                </p>
                                <h4 className="font-medium mb-1">{program.title}</h4>
                                {program.instructors && (
                                  <p className="text-sm text-muted-foreground">
                                    {program.instructors.name}
                                  </p>
                                )}
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Saved Classes */}
                  {savedClasses.length > 0 && (
                    <div>
                      <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
                        Clases
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedClasses.map((classItem) => (
                          <Link key={classItem.id} href={`/clase/${classItem.slug}`}>
                            <Card className="overflow-hidden border-0 bg-transparent group">
                              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                                <img
                                  src={classItem.thumbnail_url || "/placeholder.svg?height=200&width=320"}
                                  alt={classItem.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="h-4 w-4 text-black ml-0.5" />
                                  </div>
                                </div>
                                <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                  {classItem.duration_minutes} min
                                </div>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                                  {classItem.pillar}
                                </p>
                                <h4 className="font-medium mb-1 line-clamp-1">{classItem.title}</h4>
                                {classItem.instructors && (
                                  <p className="text-sm text-muted-foreground">
                                    {classItem.instructors.name}
                                  </p>
                                )}
                              </div>
                            </Card>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Historial Tab */}
            <TabsContent value="historial" className="mt-0">
              {history.length === 0 ? (
                <div className="text-center py-20">
                  <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-serif text-xl mb-2">Tu historial está vacío</h3>
                  <p className="text-muted-foreground mb-6">
                    Las clases que completes aparecerán aquí.
                  </p>
                  <Link 
                    href="/explorar" 
                    className="text-sm underline underline-offset-4 hover:text-muted-foreground transition-colors"
                  >
                    Comenzar una clase
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <Link key={item.id} href={`/clase/${item.slug}`}>
                      <Card className="overflow-hidden border-0 bg-secondary/20 hover:bg-secondary/40 transition-colors p-4">
                        <div className="flex gap-4">
                          <div className="relative w-32 sm:w-40 aspect-video rounded overflow-hidden shrink-0">
                            <img
                              src={item.thumbnail_url || "/placeholder.svg?height=90&width=160"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                              {item.duration_minutes} min
                            </div>
                          </div>
                          <div className="flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle className="h-3.5 w-3.5 text-green-600 shrink-0" />
                              <span className="text-xs text-muted-foreground">
                                Completada el {formatDate(item.completedAt)}
                              </span>
                            </div>
                            <h4 className="font-medium line-clamp-1">{item.title}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {item.instructors?.name} • {item.pillar}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
