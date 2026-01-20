"use client"

import Link from "next/link"
import { Sparkles, Clock, Play, ArrowRight, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MiSantuarioClientProps {
  profile: {
    full_name?: string
  } | null
  stats: {
    diasConciencia: number
    minutosIntencion: number
    clasesCompletadas: number
  }
  continueWatching: {
    progress_seconds: number
    classes: {
      id: string
      title: string
      slug: string
      thumbnail_url: string
      duration_minutes: number
      difficulty: string
      pillar: string
      instructors: { name: string } | null
    }
  } | null
  recommendedClasses: Array<{
    id: string
    title: string
    slug: string
    thumbnail_url: string
    duration_minutes: number
    difficulty: string
    pillar: string
    instructors: { name: string } | null
  }>
}

export function MiSantuarioClient({
  profile,
  stats,
  continueWatching,
  recommendedClasses,
}: MiSantuarioClientProps) {
  const firstName = profile?.full_name?.split(" ")[0] || "Usuario"

  return (
    <div className="min-h-screen">
      {/* Hero Section with Greeting */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight">
            Hola, {firstName}.
          </h1>
          <p className="mt-4 text-muted-foreground text-lg max-w-xl">
            Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
          </p>
        </div>
      </section>

      {/* Stats Section - Días de Conciencia & Minutos de Intención */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="p-6 md:p-8 border-0 bg-secondary/30">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Días de Conciencia
                </span>
              </div>
              <p className="font-serif text-4xl md:text-5xl">{stats.diasConciencia}</p>
            </Card>

            <Card className="p-6 md:p-8 border-0 bg-secondary/30">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Minutos de Intención
                </span>
              </div>
              <p className="font-serif text-4xl md:text-5xl">{stats.minutosIntencion}</p>
            </Card>

            <Card className="p-6 md:p-8 border-0 bg-secondary/30 col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Clases Completadas
                </span>
              </div>
              <p className="font-serif text-4xl md:text-5xl">{stats.clasesCompletadas}</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Continue Watching */}
      {continueWatching && (
        <section className="px-4 sm:px-6 lg:px-8 pb-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-serif text-2xl mb-6">Continuar</h2>
            <Link href={`/clase/${continueWatching.classes.slug}`}>
              <Card className="overflow-hidden border-0 bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-80 aspect-video md:aspect-auto">
                    <img
                      src={continueWatching.classes.thumbnail_url || "/placeholder.svg?height=200&width=320"}
                      alt={continueWatching.classes.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                        <Play className="h-5 w-5 text-black ml-0.5" />
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                      <div 
                        className="h-full bg-foreground"
                        style={{ 
                          width: `${Math.min(100, (continueWatching.progress_seconds / (continueWatching.classes.duration_minutes * 60)) * 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      {continueWatching.classes.pillar} • {continueWatching.classes.duration_minutes} min
                    </p>
                    <h3 className="font-serif text-xl md:text-2xl mb-2">
                      {continueWatching.classes.title}
                    </h3>
                    {continueWatching.classes.instructors && (
                      <p className="text-sm text-muted-foreground">
                        {continueWatching.classes.instructors.name}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3">
            <Link href="/mi-practica">
              <Button variant="outline" className="rounded-full bg-transparent">
                Mi Práctica
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/explorar">
              <Button variant="outline" className="rounded-full bg-transparent">
                Explorar Clases
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/programas">
              <Button variant="outline" className="rounded-full bg-transparent">
                Ver Programas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended Classes */}
      {recommendedClasses.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl">Para Ti</h2>
              <Link 
                href="/explorar" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ver todo
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedClasses.slice(0, 6).map((classItem) => (
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
                      <h3 className="font-medium mb-1 line-clamp-1">
                        {classItem.title}
                      </h3>
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
        </section>
      )}
    </div>
  )
}
