"use client"

import { useState } from "react"

interface ExpandableTextProps {
  children: string
  maxLines?: number
  className?: string
}

export function ExpandableText({ 
  children, 
  maxLines = 5,
  className = ""
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Contar aproximadamente las líneas
  const lines = children.split('\n').length
  const shouldTruncate = lines > maxLines || children.length > 400

  if (!shouldTruncate) {
    return (
      <p className={`text-zinc-500 leading-relaxed text-sm font-light italic whitespace-pre-wrap ${className}`}>
        {children}
      </p>
    )
  }

  return (
    <div className="space-y-4">
      <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
        isExpanded ? 'max-h-none' : 'max-h-40'
      }`}>
        <p className={`text-zinc-500 leading-relaxed text-sm font-light italic whitespace-pre-wrap ${className}`}>
          {children}
        </p>
        
        {/* Degradado suave si está truncado */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* ✅ BOTÓN MÁS VISUAL - NEGRITA Y BOLD */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[11px] uppercase tracking-[0.3em] text-zinc-900 hover:text-zinc-600 transition-colors font-bold"
      >
        {isExpanded ? '↑ LEER MENOS' : '↓ LEER MÁS'}
      </button>
    </div>
  )
}
