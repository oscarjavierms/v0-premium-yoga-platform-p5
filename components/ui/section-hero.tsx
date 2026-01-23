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
    <section className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
      {/* - Quitamos el hover:scale para que no distraiga.
         - Usamos un overlay mucho más sutil (bg-black/10).
      */}
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000",
          align === "top" ? "bg-top" : align === "bottom" ? "bg-bottom" : "bg-center"
        )}
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute inset-0 bg-black/15" /> 
      </div>

      {/* CONTENIDO MINIMALISTA:
         - Bajamos el tamaño de la letra drásticamente.
         - Aumentamos mucho el espacio entre letras (tracking).
         - Eliminamos el botón para que la foto respire.
      */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 pt-16">
        <h1 className="font-serif text-3xl md:text-4xl text-white tracking-[0.3em] uppercase opacity-90 drop-shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 font-sans text-white/70 text-[10px] md:text-[11px] uppercase tracking-[0.6em] font-light max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
