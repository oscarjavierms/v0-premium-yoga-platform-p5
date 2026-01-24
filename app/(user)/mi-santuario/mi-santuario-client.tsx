"use client"

import Link from "next/link"
import { Sparkles, Clock, BookOpen, ArrowRight } from "lucide-react"

interface MiSantuarioClientProps {
  userName: string
  metrics: {
    diasConciencia: number
    minutosIntencion: number
    clasesCompletadas: number
  }
}

export function MiSantuarioClient({ userName, metrics }: MiSantuarioClientProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Reducido pt-32 a pt-8 para eliminar el espacio vacío superior */}
      <main className="max-w-6xl mx-auto px-6 pt-8 pb-20">
        
        {/* Hero Section - Reducido mb-16 a mb-10 para mayor fluidez */}
        <div className="mb-10">
          <h1 className="font-serif text-5xl md:text-6xl text-black mb-3">
            Hola, {userName}.
          </h1>
          <p className="text-black/60 text-lg font-light max-w-xl italic">
            Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
          </p>
        </div>

        {/* Metrics Cards - Reducido mb-16 a mb-12 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-[#F5F5F5] rounded-2xl p-8 border border-black/[0.03]">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-black/40" strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-black/40">
                DÍAS DE CONCIENCIA
              </span>
            </div>
            <div className="font-serif text-6xl text-black">
              {metrics.diasConciencia}
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-2xl p-8 border border-black/[0.03]">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-black/40" strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-black/40">
                MINUTOS DE INTENCIÓN
              </span>
            </div>
            <div className="font-serif text-6xl text-black">
              {metrics.minutosIntencion}
            </div>
          </div>

          <div className="bg-[#F5F5F5] rounded-2xl p-8 border border-black/[0.03]">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-black/40" strokeWidth={1.5} />
              <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-black/40">
                CLASES COMPLETADAS
              </span>
            </div>
            <div className="font-serif text-6xl text-black">
              {metrics.clasesCompletadas}
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4">
          <Link
            href="/mi-practica"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full text-sm font-bold tracking-wider hover:bg-black/80 transition-all uppercase"
          >
            Mi Práctica
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/explorar"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white border border-black/10 text-black rounded-full text-sm font-bold tracking-wider hover:border-black/20 hover:bg-black/[0.02] transition-all uppercase"
          >
            Explorar Clases
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/programas"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-white border border-black/10 text-black rounded-full text-sm font-bold tracking-wider hover:border-black/20 hover:bg-black/[0.02] transition-all uppercase"
          >
            Ver Programas
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  )
}
