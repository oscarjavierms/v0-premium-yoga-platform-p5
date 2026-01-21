"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Play, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src="/minimalist-yoga-studio-black-and-white-woman-medit.jpg" alt="Yoga practice" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Tagline */}
          <p className="text-background/80 text-sm tracking-[0.3em] uppercase mb-8">
            Bienestar para el alto rendimiento
          </p>

          {/* Main Headline */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-background leading-tight tracking-tight text-balance">
            Bienestar que sostiene vidas exigentes
          </h1>

          {/* Subheadline */}
          <p className="mt-8 text-lg md:text-xl text-background/80 max-w-2xl mx-auto leading-relaxed text-pretty">
            Un sistema de bienestar funcional diseñado para profesionales que entienden que su cuerpo y su mente son
            activos estratégicos.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/registro">
              <Button
                size="lg"
                className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-sm tracking-wide uppercase"
              >
                Comenzar ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-background text-background hover:bg-background/10 px-8 py-6 text-sm tracking-wide uppercase bg-transparent"
            >
              <Play className="mr-2 h-4 w-4" />
              Ver demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-16 flex items-center justify-center gap-8 text-background/60">
            <div className="text-center">
              <p className="text-3xl font-serif">500+</p>
              <p className="text-xs tracking-wide uppercase mt-1">Clases</p>
            </div>
            <div className="w-px h-12 bg-background/20" />
            <div className="text-center">
              <p className="text-3xl font-serif">15+</p>
              <p className="text-xs tracking-wide uppercase mt-1">Profesores</p>
            </div>
            <div className="w-px h-12 bg-background/20" />
            <div className="text-center">
              <p className="text-3xl font-serif">10K+</p>
              <p className="text-xs tracking-wide uppercase mt-1">Miembros</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-16 bg-gradient-to-b from-background/0 to-background/60" />
      </div>
    </section>
  )
}
