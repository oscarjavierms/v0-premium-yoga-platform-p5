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
    /* h-[90vh]: La imagen ocupa el 100% de la altura de la pantalla */
    <section className="relative w-full h-[100vh] overflow-hidden">
      <div 
        className={cn(
          "absolute inset-0 bg-cover bg-no-repeat transition-transform duration-[3000ms] ease-out scale-105 hover:scale-100",
          align === "top" ? "bg-top" : align === "bottom" ? "bg-bottom" : "bg-center"
        )}
        style={{ backgroundImage: `url('${image}')` }}
      >
        {/* Overlay ultra-fino para no apagar la foto original */}
        <div className="absolute inset-0 bg-black/10" /> 
      </div>

      {/* justify-center: Mantenemos el texto centrado pero con tipografía muy fina
          o si prefieres que no tape NADA el centro, podemos usar justify-end y pb-32
      */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <div className="space-y-6">
          <h1 className="font-serif text-4xl md:text-6xl text-white tracking-[0.3em] uppercase drop-shadow-md opacity-95">
            {title}
          </h1>
          {subtitle && (
            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-px bg-white/30" />
              <p className="font-sans text-white/90 text-[10px] md:text-xs tracking-[0.6em] uppercase font-light max-w-2xl leading-relaxed">
                {subtitle}
              </p>
              <div className="w-8 h-px bg-white/30" />
            </div>
          )}
        </div>
      </div>

      {/* Indicador sutil de scroll (opcional, da un toque muy pro) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
