"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Play, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ClassItem {
  id: string
  title: string
  slug: string
  thumbnail_url: string
  duration_minutes: number
  difficulty: string
  pillar: string
  is_free: boolean
  instructors: { name: string } | null
}

interface ExplorarClientProps {
  classes: ClassItem[]
  pillars: string[]
  difficulties: string[]
  initialFilters: {
    categoria: string
    nivel: string
  }
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

export function ExplorarClient({
  classes,
  pillars,
  difficulties,
  initialFilters,
}: ExplorarClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(initialFilters.categoria)
  const [activeLevel, setActiveLevel] = useState(initialFilters.nivel)

  const updateFilters = (categoria?: string, nivel?: string) => {
    const params = new URLSearchParams()
    
    const newCategoria = categoria !== undefined ? categoria : activeCategory
    const newNivel = nivel !== undefined ? nivel : activeLevel
    
    if (newCategoria) params.set("categoria", newCategoria)
    if (newNivel) params.set("nivel", newNivel)
    
    router.push(`/explorar?${params.toString()}`)
    
    if (categoria !== undefined) setActiveCategory(categoria)
    if (nivel !== undefined) setActiveLevel(nivel)
  }

  const clearFilters = () => {
    setActiveCategory("")
    setActiveLevel("")
    setSearchQuery("")
    router.push("/explorar")
  }

  // Filter by search query (client-side)
  const filteredClasses = searchQuery
    ? classes.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructors?.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : classes

  const hasActiveFilters = activeCategory || activeLevel || searchQuery

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-serif text-4xl sm:text-5xl tracking-tight mb-4">
            Explorar Clases
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Descubre clases que se adaptan a tu momento y necesidades.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          {/* Search */}
          <div className="relative mb-6 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar clases o instructores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-secondary/30 border-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={!activeCategory ? "default" : "outline"}
              size="sm"
              className={cn("rounded-full", activeCategory && "bg-transparent")}
              onClick={() => updateFilters("")}
            >
              Todos
            </Button>
            {pillars.map((pillar) => (
              <Button
                key={pillar}
                variant={activeCategory === pillar ? "default" : "outline"}
                size="sm"
                className={cn("rounded-full", activeCategory !== pillar && "bg-transparent")}
                onClick={() => updateFilters(pillar)}
              >
                {pillarLabels[pillar] || pillar}
              </Button>
            ))}
          </div>

          {/* Level Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground mr-2">Nivel:</span>
            <Button
              variant={!activeLevel ? "default" : "outline"}
              size="sm"
              className={cn("rounded-full h-7 text-xs", activeLevel && "bg-transparent")}
              onClick={() => updateFilters(undefined, "")}
            >
              Todos
            </Button>
            {difficulties.map((level) => (
              <Button
                key={level}
                variant={activeLevel === level ? "default" : "outline"}
                size="sm"
                className={cn("rounded-full h-7 text-xs", activeLevel !== level && "bg-transparent")}
                onClick={() => updateFilters(undefined, level)}
              >
                {difficultyLabels[level] || level}
              </Button>
            ))}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors ml-4"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground mb-6">
            {filteredClasses.length} {filteredClasses.length === 1 ? "clase" : "clases"} encontradas
          </p>

          {filteredClasses.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No se encontraron clases con estos filtros.</p>
              <Button variant="outline" onClick={clearFilters} className="rounded-full bg-transparent">
                Ver todas las clases
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredClasses.map((classItem) => (
                <Link key={classItem.id} href={`/clase/${classItem.slug}`}>
                  <Card className="overflow-hidden border-0 bg-transparent group h-full">
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-3">
                      <img
                        src={classItem.thumbnail_url || "/placeholder.svg?height=180&width=320"}
                        alt={classItem.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-4 w-4 text-black ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                        {classItem.duration_minutes} min
                      </div>
                      {classItem.is_free && (
                        <div className="absolute top-2 left-2 bg-white text-black text-xs font-medium px-2 py-0.5 rounded">
                          Gratis
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                        {pillarLabels[classItem.pillar] || classItem.pillar}
                      </p>
                      <h3 className="font-medium mb-1 line-clamp-2">{classItem.title}</h3>
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
          )}
        </div>
      </section>
    </div>
  )
}
