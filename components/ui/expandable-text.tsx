"use client"

import { useState } from "react"

interface ExpandableTextProps {
  children: string
  maxLines?: number
  className?: string
}

export function ExpandableText({ 
  children, 
  maxLines = 3,
  className = ""
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Contar aproximadamente las líneas (ajusta según tu contenido)
  const lines = children.split('\n').length
  const shouldTruncate = lines > maxLines || children.length > 300

  if (!shouldTruncate) {
    return (
      <p className={`text-zinc-500 leading-relaxed text-sm font-light italic whitespace-pre-wrap ${className}`}>
        {children}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className={`relative overflow-hidden transition-all duration-500 ease-in-out ${
        isExpanded ? 'max-h-none' : 'max-h-24'
      }`}>
        <p className={`text-zinc-500 leading-relaxed text-sm font-light italic whitespace-pre-wrap ${className}`}>
          {children}
        </p>
        
        {/* Degradado suave si está truncado */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Botón "Leer más" / "Leer menos" - Premium */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-zinc-900 transition-colors font-light italic"
      >
        {isExpanded ? '╌ Leer menos ╌' : '╌ Leer más ╌'}
      </button>
    </div>
  )
}
