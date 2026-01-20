"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, BookOpen } from "lucide-react"
import type { Program } from "@/types/content"
import { LEVEL_LABELS, PILLAR_LABELS } from "@/types/content"

interface ProgramCardProps {
  program: Program
  variant?: "default" | "featured"
}

export default function ProgramCard({ program, variant = "default" }: ProgramCardProps) {
  if (variant === "featured") {
    return (
      <article className="group relative overflow-hidden rounded-xl bg-card border border-border">
        <Link href={`/programa/${program.slug}`} className="block">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
              <Image
                src={program.thumbnail_url || "/placeholder.svg?height=600&width=800&query=yoga program"}
                alt={program.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-center">
              <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
                {PILLAR_LABELS[program.pillar]} • Programa destacado
              </span>

              <h3 className="font-serif text-3xl font-medium mb-4 group-hover:underline underline-offset-4">
                {program.title}
              </h3>

              <p className="text-muted-foreground mb-6 line-clamp-3">
                {program.short_description || program.description}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                {program.duration_days && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {program.duration_days} días
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {program.total_classes} clases
                </span>
                <span>{LEVEL_LABELS[program.level]}</span>
              </div>

              {program.instructor && (
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                    {program.instructor.avatar_url && (
                      <Image
                        src={program.instructor.avatar_url || "/placeholder.svg"}
                        alt={program.instructor.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <span className="text-sm">con {program.instructor.name}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="group relative overflow-hidden rounded-lg bg-card border border-border hover:border-foreground/20 transition-all duration-300">
      <Link href={`/programa/${program.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={program.thumbnail_url || "/placeholder.svg?height=600&width=800&query=yoga program"}
            alt={program.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Duration badge */}
          {program.duration_days && (
            <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 text-black text-xs font-semibold rounded-full">
              {program.duration_days} días
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {PILLAR_LABELS[program.pillar]}
          </span>

          <h3 className="font-serif text-xl font-medium mt-2 mb-2 group-hover:underline underline-offset-4">
            {program.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{program.short_description}</p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {program.total_classes} clases
            </span>
            <span>{LEVEL_LABELS[program.level]}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
