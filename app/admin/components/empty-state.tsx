import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
}

export function EmptyState({ icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <h3 className="font-medium text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button>{actionLabel}</Button>
        </Link>
      )}
    </div>
  )
}
