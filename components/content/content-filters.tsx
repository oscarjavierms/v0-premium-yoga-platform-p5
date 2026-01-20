"use client"

import { useState } from "react"
import { Filter, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { PILLAR_LABELS, LEVEL_LABELS, type PillarType, type LevelType } from "@/types/content"
import { Button } from "@/components/ui/button"

interface ContentFiltersProps {
  onFilterChange: (filters: FilterState) => void
  showDuration?: boolean
  className?: string
}

export interface FilterState {
  pillar: PillarType | null
  level: LevelType | null
  duration: "short" | "medium" | "long" | null
}

const DURATION_OPTIONS = [
  { value: "short", label: "< 15 min" },
  { value: "medium", label: "15-30 min" },
  { value: "long", label: "30+ min" },
] as const

export default function ContentFilters({ onFilterChange, showDuration = true, className }: ContentFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    pillar: null,
    level: null,
    duration: null,
  })
  const [isOpen, setIsOpen] = useState(false)

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = {
      ...filters,
      [key]: filters[key] === value ? null : value,
    }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = { pillar: null, level: null, duration: null }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
  }

  const hasActiveFilters = filters.pillar || filters.level || filters.duration

  return (
    <div className={cn("space-y-4", className)}>
      {/* Mobile toggle */}
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 md:hidden text-sm font-medium">
        <Filter className="w-4 h-4" />
        Filtros
        {hasActiveFilters && (
          <span className="w-5 h-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
            {[filters.pillar, filters.level, filters.duration].filter(Boolean).length}
          </span>
        )}
      </button>

      {/* Filter groups */}
      <div
        className={cn(
          "space-y-6 md:space-y-0 md:flex md:flex-wrap md:items-center md:gap-8",
          !isOpen && "hidden md:flex",
        )}
      >
        {/* Pillar filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Categoría</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PILLAR_LABELS) as PillarType[]).map((pillar) => (
              <button
                key={pillar}
                onClick={() => updateFilter("pillar", pillar)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border transition-all",
                  filters.pillar === pillar
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground/50",
                )}
              >
                {PILLAR_LABELS[pillar]}
              </button>
            ))}
          </div>
        </div>

        {/* Level filter */}
        <div className="space-y-2">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nivel</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(LEVEL_LABELS) as LevelType[]).map((level) => (
              <button
                key={level}
                onClick={() => updateFilter("level", level)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-full border transition-all",
                  filters.level === level
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:border-foreground/50",
                )}
              >
                {LEVEL_LABELS[level]}
              </button>
            ))}
          </div>
        </div>

        {/* Duration filter */}
        {showDuration && (
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Duración</label>
            <div className="flex flex-wrap gap-2">
              {DURATION_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateFilter("duration", option.value)}
                  className={cn(
                    "px-3 py-1.5 text-sm rounded-full border transition-all",
                    filters.duration === option.value
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:border-foreground/50",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clear filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
