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
    /* h-[70vh]: Esto hará que la imagen sea mucho más alta y se vea más contenido */
    <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000",
          align === "top" ? "bg-top" : align === "bottom" ? "bg-bottom" : "bg-center"
        )}
        style={{ backgroundImage: `url('${image}')` }}
      >
        {/* Un overlay muy suave para no apagar los colores de la foto */}
        <div className="absolute inset-0 bg-black/10" /> 
      </div>

      {/* Contenido centrado pero con aire */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-4xl md:text-6xl text-white tracking-[0.2em] uppercase drop-shadow-md">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-6 font-sans text-white/90 text-[10px] md:text-xs tracking-[0.5em] uppercase font-light max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
        
        {/* Eliminamos el botón para que no tape el centro de la imagen */}
      </div>
    </section>
  );
}
