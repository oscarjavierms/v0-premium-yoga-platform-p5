"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, ChevronRight, Clock, Sparkles, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Class, UserProgress } from "@/types/content"

interface DashboardClientProps {
  profile: any
  preferences: any
  inProgressClasses: Array<{ class: Class } & UserProgress>
  favorites: Array<{ class: Class }>
  recommendedClasses: Class[]
  stats: {
    completedClasses: number
    favoritesCount: number
    currentStreak: number
    totalMinutes?: number
  }
}

export default function DashboardClient({
  profile,
  preferences,
  inProgressClasses,
  favorites,
  recommendedClasses,
  stats,
}: DashboardClientProps) {
  const firstName = profile?.full_name?.split(" ")[0] || "Alma"

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Quiet Luxury */}
      <header className="sticky top-0 z-50 bg-background/98 backdrop-blur-sm">
        <div className="container mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full border border-foreground/80 flex items-center justify-center">
              <span className="font-serif text-sm">e</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/explorar?categoria=yoga" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Yoga
            </Link>
            <Link href="/explorar?categoria=meditacion" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Meditación
            </Link>
            <Link href="/explorar?categoria=fitness" className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
              Fitness
            </Link>
            <Link href="/dashboard" className="text-sm tracking-wide text-foreground font-medium">
              Mi Santuario
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/mi-cuenta">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <form action="/auth/logout" method="POST">
              <Button type="submit" variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-8 py-12 md:py-16">
        {/* Mi Santuario - Welcome */}
        <section className="mb-16">
          <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">Bienvenida a tu espacio</p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
            Mi Santuario
          </h1>
          <p className="mt-4 text-lg text-muted-foreground font-light">Hola, {firstName}.</p>
        </section>

        {/* Intention Counters - Quiet Luxury */}
        <section className="grid grid-cols-2 gap-8 md:gap-12 mb-20 max-w-2xl">
          <IntentionCounter 
            value={stats.currentStreak || stats.completedClasses} 
            label="Días de Conciencia" 
          />
          <IntentionCounter 
            value={stats.totalMinutes || stats.completedClasses * 25} 
            label="Minutos de Intención" 
          />
        </section>

        {/* Mi Práctica - Class Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground">Mi Práctica</h2>
            <Link href="/mi-practica">
              <Button variant="ghost" className="gap-1 text-muted-foreground text-sm">
                Ver todo
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {inProgressClasses.length > 0 || recommendedClasses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressClasses.slice(0, 3).map((item) => (
                <PracticeCard
                  key={item.id}
                  classData={item.class}
                  progress={item.progress_seconds}
                  isInProgress
                />
              ))}
              {recommendedClasses.slice(0, 3 - inProgressClasses.length).map((classItem) => (
                <PracticeCard key={classItem.id} classData={classItem} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground mb-6 font-light">Comienza tu viaje de bienestar</p>
              <Link href="/explorar">
                <Button className="rounded-full px-8">Explorar clases</Button>
              </Link>
            </div>
          )}
        </section>

        {/* Recommended Section */}
        {recommendedClasses.length > 3 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl font-light text-foreground">Recomendado</h2>
              <Link href="/explorar">
                <Button variant="ghost" className="gap-1 text-muted-foreground text-sm">
                  Ver todo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedClasses.slice(3, 6).map((classItem) => (
                <PracticeCard key={classItem.id} classData={classItem} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

// Intention Counter - Quiet Luxury Style
function IntentionCounter({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-muted-foreground/60" />
      </div>
      <p className="font-serif text-4xl md:text-5xl font-light text-foreground tracking-tight">{value}</p>
      <p className="text-sm text-muted-foreground mt-2 tracking-wide">{label}</p>
    </div>
  )
}

// Practice Card - Alo Moves inspired 16:9 grid
function PracticeCard({
  classData,
  progress,
  isInProgress,
}: {
  classData: Class
  progress?: number
  isInProgress?: boolean
}) {
  const progressPercent = progress && classData.duration_minutes 
    ? Math.round((progress / (classData.duration_minutes * 60)) * 100)
    : 0

  return (
    <Link href={`/clase/${classData.slug}`} className="group block">
      <div className="relative aspect-video overflow-hidden bg-muted/50 mb-4">
        <Image
          src={classData.thumbnail_url || "/placeholder.svg?height=400&width=600&query=yoga class peaceful"}
          alt={classData.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 rounded-full bg-white/95 flex items-center justify-center">
            <Play className="w-6 h-6 text-foreground ml-1" fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {classData.duration_minutes} min
        </div>

        {/* Progress bar for in-progress classes */}
        {isInProgress && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
            <div 
              className="h-full bg-foreground/80" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        )}
      </div>

      <h3 className="font-medium text-foreground line-clamp-1 group-hover:underline underline-offset-4 decoration-muted-foreground/50">
        {classData.title}
      </h3>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
        {classData.instructor && <span>{classData.instructor.name}</span>}
        {classData.difficulty && (
          <>
            <span className="text-muted-foreground/40">·</span>
            <span className="capitalize">{classData.difficulty}</span>
          </>
        )}
      </div>
    </Link>
  )
}
