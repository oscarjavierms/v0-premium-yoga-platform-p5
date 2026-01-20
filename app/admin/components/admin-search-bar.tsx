"use client"

import { Suspense } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          className="w-full h-10 pl-10 pr-4 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <Button variant="outline" className="gap-2 bg-transparent">
        <Filter className="w-4 h-4" />
        Filtros
      </Button>
    </div>
  )
}

export default function AdminSearchBar({ placeholder }: { placeholder: string }) {
  return (
    <Suspense fallback={<div className="h-10 mb-6" />}>
      <SearchInput placeholder={placeholder} />
    </Suspense>
  )
}
