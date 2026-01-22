"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image con overlay más elegante */}
      <div className="absolute inset-0">
        <img 
          src="/minimalist-yoga-studio-black-and-white-woman-medit.jpg" 
          alt="Yoga practice" 
          className="w-full h-full object-cover grayscale opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p className="text-white/60 text-[10px] tracking-[0.4em] uppercase mb-8 font-bold">
            SANTUARIO — Bienestar para el alto rendimiento
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-white leading-[0.9] tracking-tighter text-balance">
            Bienestar que sostiene <br/> <span className="italic">vidas exigentes</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-10 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light italic">
            Un sistema de bienestar funcional diseñado para profesionales que entienden que su cuerpo y su mente son activos estratégicos.
          </p>

          {/* CTA Buttons - CORREGIDOS */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth/registro">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90 px-10 py-7 text-[10px] tracking-[0.2em] uppercase font-bold rounded-full transition-all hover:scale-105"
              >
                Comenzar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white/20 text-white hover:bg-white/10 px-10 py-7 text-[10px] tracking-[0.2em] uppercase font-bold bg-transparent rounded-full backdrop-blur-sm"
            >
              <Play className="mr-2 h-4 w-4 fill-white" />
              Ver demo
            </Button>
          </div>

          {/* Social Proof Estilo Editorial */}
          <div className="mt-24 flex items-center justify-center gap-12 text-white/40">
            <div className="text-center">
              <p className="text-4xl font-serif text-white italic">500+</p>
              <p className="text-[9px] tracking-[0.2em] uppercase mt-2 font-bold">Clases</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-4xl font-serif text-white italic">15+</p>
              <p className="text-[9px] tracking-[0.2em] uppercase mt-2 font-bold">Maestros</p>
            </div>
            <div className="w-px h-12 bg-white/10" />
            <div className="text-center">
              <p className="text-4xl font-serif text-white italic">10K+</p>
              <p className="text-[9px] tracking-[0.2em] uppercase mt-2 font-bold">Miembros</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/0 via-white/50 to-white/0" />
      </div>
    </section>
  )
}
