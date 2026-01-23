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
    <section className="relative w-full h-[90vh] overflow-hidden bg-neutral-900">
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000",
          // Forzamos el centro absoluto para que no se vea torcida
          align === "top" ? "bg-top" : align === "bottom" ? "bg-bottom" : "bg-center"
        )}
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute inset-0 bg-black/10" /> 
      </div>

      {/* Cambiamos justify-center por justify-end para bajar las letras.
          pb-24 empuja el texto hacia arriba lo justo para que no tape el centro.
      */}
      <div className="relative h-full flex flex-col items-center justify-end text-center px-6 pb-24">
        <div className="space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl text-white tracking-[0.3em] uppercase drop-shadow-md">
            {title}
          </h1>
          {subtitle && (
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-white/30" />
              <p className="font-sans text-white/90 text-[10px] md:text-xs tracking-[0.6em] uppercase font-light max-w-2xl">
                {subtitle}
              </p>
              <div className="w-8 h-px bg-white/30" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
