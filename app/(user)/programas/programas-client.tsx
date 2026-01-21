"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, Clock, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Program {
  id: string
  title: string
  slug: string
  description: string
  thumbnail_url: string
  duration_weeks: number
  difficulty: string
  pillar: string
  instructors: { name: string; avatar_url: string } | null
}

interface ProgramasClientProps {
  featuredProgram: Program | null
  programs: Program[]
  pillars: string[]
}

const pillarLabels: Record<string, string> = {
  movement: "Movimiento",
  mindfulness: "Meditación",
  nutrition: "Nutrición",
  sleep: "Descanso",
  stress: "Estrés",
  connection: "Conexión",
  yoga: "Yoga",
  fitness: "Fitness",
}

const difficultyLabels: Record<string, string> = {
  beginner: "Principiante",
  intermediate: "Intermedio",
  advanced: "Avanzado",
}

export function ProgramasClient({
  featuredProgram,
  programs,
  pillars,
}: ProgramasClientProps) {
  const [activeFilter, setActiveFilter] = useState<string>("todos")

  const filteredPrograms = activeFilter === "todos"
    ? programs
    : programs.filter(p => p.pillar === activeFilter)

  return (
    <div className="min-h-screen">
      {/* Featured Program Hero */}
      {featuredProgram && (
        <section className="relative">
          <div className="absolute inset-0">
            <img
              src={featuredProgram.thumbnail_url || "/placeholder.svg?height=600&width=1200"}
              alt={featuredProgram.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          </div>
          <div className="relative px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="max-w-7xl mx-auto">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-widest text-white/70 mb-4">
                  Programa Destacado
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white mb-4">
                  {featuredProgram.title}
                </h1>
                <p className="text-white/80 text-lg mb-6 line-clamp-3">
                  {featuredProgram.description}
                </p>
                <div className="flex items-center gap-4 text-white/70 text-sm mb-8">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {featuredProgram.duration_weeks} semanas
                  </span>
                  <span>•</span>
                  <span>{difficultyLabels[featuredProgram.difficulty] || featuredProgram.difficulty}</span>
                </div>
                <Link href={`/programa/${featuredProgram.slug}`}>
                  <Button className="rounded-full gap-2 px-6">
                    <Play className="h-4 w-4" />
                    Comenzar Programa
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Programs Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h2 className="font-serif text-3xl">Explora Nuestros Programas</h2>
              <p className="text-muted-foreground mt-2">
                Encuentra la serie perfecta para tus objetivos.
              </p>
            </div>
            
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeFilter === "todos" ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full",
                  activeFilter !== "todos" && "bg-transparent"
                )}
                onClick={() => setActiveFilter("todos")}
              >
                Todos
              </Button>
              {pillars.map((pillar) => (
                <Button
                  key={pillar}
                  variant={activeFilter === pillar ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-full",
                    activeFilter !== pillar && "bg-transparent"
                  )}
                  onClick={() => setActiveFilter(pillar)}
                >
                  {pillarLabels[pillar] || pillar}
                </Button>
              ))}
            </div>
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No hay programas disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrograms.map((program) => (
                <Link key={program.id} href={`/programa/${program.slug}`}>
                  <Card className="overflow-hidden border-0 bg-transparent group h-full">
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-4">
                      <img
                        src={program.thumbnail_url || "/placeholder.svg?height=300&width=480"}
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
                          <span>{program.duration_weeks} semanas</span>
                          <span>•</span>
                          <span>{difficultyLabels[program.difficulty] || program.difficulty}</span>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-5 w-5 text-black" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        {pillarLabels[program.pillar] || program.pillar}
                      </p>
                      <h3 className="font-serif text-xl mb-2">{program.title}</h3>
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
          )}
        </div>
      </section>
    </div>
  )
}
