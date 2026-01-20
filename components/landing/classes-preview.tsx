"use client"

import { useState } from "react"
import { Play, Clock, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = ["Todo", "Yoga", "Meditación", "Respiración", "Movilidad", "Fitness"]

const classes = [
  {
    title: "Despertar Energético",
    category: "Yoga",
    duration: "20 min",
    level: "Principiante",
    instructor: "María García",
    image: "/yoga-morning-stretch-elegant-black-and-white.jpg",
  },
  {
    title: "Reset del Sistema Nervioso",
    category: "Respiración",
    duration: "15 min",
    level: "Todos",
    instructor: "Carlos Ruiz",
    image: "/breathing-meditation-calm-black-and-white.jpg",
  },
  {
    title: "Desbloqueo de Caderas",
    category: "Movilidad",
    duration: "25 min",
    level: "Intermedio",
    instructor: "Ana Torres",
    image: "/hip-mobility-stretch-elegant-black-and-white.jpg",
  },
  {
    title: "Claridad Mental",
    category: "Meditación",
    duration: "10 min",
    level: "Todos",
    instructor: "David López",
    image: "/meditation-focus-calm-black-and-white-minimalist.jpg",
  },
  {
    title: "Fuerza Funcional",
    category: "Fitness",
    duration: "30 min",
    level: "Avanzado",
    instructor: "Laura Martín",
    image: "/functional-fitness-strength-training-black-and-whi.jpg",
  },
  {
    title: "Restauración Profunda",
    category: "Yoga",
    duration: "45 min",
    level: "Todos",
    instructor: "María García",
    image: "/restorative-yoga-relaxation-black-and-white-elegan.jpg",
  },
]

export function ClassesPreview() {
  const [activeCategory, setActiveCategory] = useState("Todo")

  const filteredClasses = activeCategory === "Todo" ? classes : classes.filter((c) => c.category === activeCategory)

  return (
    <section id="clases" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Las clases</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
              Contenido diseñado para tu realidad
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Clases cortas, directas, sin relleno. Diseñadas para integrarse al día real de un profesional.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-4 py-2 text-xs tracking-wide uppercase transition-colors",
                  activeCategory === category
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground hover:bg-secondary/80",
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Classes Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((classItem, index) => (
            <div key={index} className="group cursor-pointer">
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
                <img
                  src={classItem.image || "/placeholder.svg"}
                  alt={classItem.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-6 w-6 text-foreground ml-1" />
                  </div>
                </div>
                {/* Category Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-background/90 text-xs tracking-wide uppercase">
                  {classItem.category}
                </span>
              </div>

              {/* Info */}
              <div className="mt-4">
                <h3 className="text-lg font-medium group-hover:text-foreground/70 transition-colors">
                  {classItem.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{classItem.instructor}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {classItem.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {classItem.level}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
