"use client"

import type React from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  change?: string
  loading?: boolean
}

export function StatCard({ label, value, icon, change, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-9 w-20 mb-2" />
        <Skeleton className="h-4 w-24" />
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">{icon}</span>
        {change && <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">{change}</span>}
      </div>
      <p className="text-3xl font-medium">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </div>
  )
}

export function StatCardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">{children}</div>
}
