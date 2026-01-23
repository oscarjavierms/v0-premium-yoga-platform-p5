import React from 'react';
import { cn } from "@/lib/utils"

interface SectionHeroProps {
  title: string;
  subtitle?: string;
  image: string;
  align?: "top" | "center"; // Nueva opción para no cortar caras
}

export function SectionHero({ title, subtitle, image, align = "top" }: SectionHeroProps) {
  return (
    <section className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
      {/* bg-[center_top]: Asegura que la parte superior de la foto (caras/paisaje) sea prioridad.
        transition-transform: Mantiene el efecto suave al cargar.
      */}
      <div 
        className={cn(
          "absolute inset-0 bg-cover transition-transform duration-1000",
          align === "top" ? "bg-[center_top]" : "bg-center"
        )}
        style={{ backgroundImage: `url('${image}')` }}
      >
        {/* Capa de contraste más sutil (20%) para que la foto brille más */}
        <div className="absolute inset-0 bg-black/20" /> 
      </div>

      {/* Contenido del Hero: Texto más pequeño y elegante */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-12">
        <h1 className="font-serif text-3xl md:text-5xl text-white mb-4 tracking-[0.1em] opacity-95">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-white/80 text-[9px] md:text-[11px] uppercase tracking-[0.5em] font-light max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
