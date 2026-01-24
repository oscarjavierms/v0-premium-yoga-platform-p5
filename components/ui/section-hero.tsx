import React from 'react';
import { cn } from "@/lib/utils"

interface SectionHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  align?: "top" | "center" | "bottom";
}

export function SectionHero({ title, subtitle, image, align = "center" }: SectionHeroProps) {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-neutral-900">
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000",
          align === "top" ? "bg-top" : align === "bottom" ? "bg-bottom" : "bg-center"
        )}
        style={{ backgroundImage: `url('${image}')` }}
      >
        {/* Un degradado sutil en la base ayuda a que el texto siempre sea legible */}
        <div className="absolute inset-0 bg-black/20 md:bg-black/10" /> 
      </div>

      {/* AJUSTE DE ALTURA:
          - pb-[40vh]: En móviles sube el texto hasta el 40% de la pantalla (mucho más centrado).
          - md:pb-48: En computadoras vuelve a su posición original elegante.
      */}
      <div className="relative h-full flex flex-col items-center justify-end text-center px-6 pb-[40vh] md:pb-48">
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-7xl text-white tracking-[0.2em] uppercase drop-shadow-xl">
            {title}
          </h1>
          {subtitle && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="hidden md:block w-12 h-px bg-white/30" />
              <p className="font-sans text-white/90 text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] uppercase font-light max-w-[280px] md:max-w-2xl leading-relaxed">
                {subtitle}
              </p>
              <div className="hidden md:block w-12 h-px bg-white/30" />
            </div>
          )}
        </div>
      </div>

      {/* Indicador de scroll sutil */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
