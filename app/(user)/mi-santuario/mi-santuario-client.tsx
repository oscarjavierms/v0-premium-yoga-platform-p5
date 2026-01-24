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
      {/* pt-8 mantiene el contenido bien arriba, cerca del header */}
      <main className="max-w-6xl mx-auto px-6 pt-8 pb-20">
        
        {/* Hero Section - Estilo Editorial con Fuerza Visual */}
        <div className="mb-12">
          <span className="text-[10px] tracking-[0.4em] font-bold text-black/20 uppercase block mb-3">
            Tu santuario personal
          </span>
          <h1 className="font-serif text-6xl md:text-7xl text-black mb-4 tracking-tighter leading-[1.1]">
            Hola, {userName}.
          </h1>
          <p className="text-black/60 text-lg font-light max-w-xl italic border-l border-black/10 pl-6">
            Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#F5F5F5] rounded-2xl p-8 border border-black/[0.03] hover:shadow-sm transition-shadow">
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

          <div className="bg-[#F5F5F5] rounded-2xl p-8 border border-black/[0.03] hover:shadow-sm transition-shadow">
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

          <div className="bg-[#F5F5F5] rounded-2xl p-8 border border-black/[0.03] hover:shadow-sm transition-shadow">
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
            className="group inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-full text-xs font-bold tracking-[0.2em] hover:bg-black/80 transition-all uppercase shadow-lg shadow-black/10"
          >
            Mi Práctica
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/explorar"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white border border-black/10 text-black rounded-full text-xs font-bold tracking-[0.2em] hover:border-black/20 hover:bg-black/[0.02] transition-all uppercase"
          >
            Explorar Clases
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/programas"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white border border-black/10 text-black rounded-full text-xs font-bold tracking-[0.2em] hover:border-black/20 hover:bg-black/[0.02] transition-all uppercase"
          >
            Ver Programas
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>
    </div>
  )
}
