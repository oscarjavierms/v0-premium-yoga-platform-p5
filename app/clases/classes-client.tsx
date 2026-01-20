"use client"

import { useState, useMemo } from "react"
import ContentFilters, { type FilterState } from "@/components/content/content-filters"
import ClassCard from "@/components/content/class-card"
import type { Class } from "@/types/content"

interface ClassesClientProps {
  initialClasses: Class[]
}

export default function ClassesClient({ initialClasses }: ClassesClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    pillar: null,
    level: null,
    duration: null,
  })

  const filteredClasses = useMemo(() => {
    return initialClasses.filter((classItem) => {
      // Filter by pillar
      if (filters.pillar && classItem.pillar !== filters.pillar) {
        return false
      }

      // Filter by level
      if (filters.level && classItem.level !== filters.level && classItem.level !== "todos") {
        return false
      }

      // Filter by duration
      if (filters.duration) {
        const duration = classItem.duration_minutes
        if (filters.duration === "short" && duration >= 15) return false
        if (filters.duration === "medium" && (duration < 15 || duration > 30)) return false
        if (filters.duration === "long" && duration <= 30) return false
      }

      return true
    })
  }, [initialClasses, filters])

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Filters */}
        <ContentFilters onFilterChange={setFilters} className="mb-10 pb-8 border-b border-border" />

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredClasses.length} {filteredClasses.length === 1 ? "clase" : "clases"} encontradas
        </p>

        {/* Classes grid */}
        {filteredClasses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredClasses.map((classItem) => (
              <ClassCard key={classItem.id} classData={classItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No se encontraron clases con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </section>
  )
}
