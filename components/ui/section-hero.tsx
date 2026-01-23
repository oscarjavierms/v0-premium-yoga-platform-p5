import React from 'react';

interface SectionHeroProps {
  title: string;
  subtitle?: string;
  image: string;
}

export function SectionHero({ title, subtitle, image }: SectionHeroProps) {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden mb-12">
      {/* Imagen de fondo con overlay oscuro para que el texto se lea bien */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url('${image}')` }}
      >
        <div className="absolute inset-0 bg-black/30" /> {/* Capa de contraste */}
      </div>

      {/* Contenido del Hero */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-white/90 text-sm md:text-lg uppercase tracking-[0.3em] font-light">
            {subtitle}
          </p>
        )}
        
        {/* Botón Minimalista opcional */}
        <div className="mt-8">
          <button className="px-8 py-3 bg-white text-black font-sans text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
            Explorar Sesiones
          </button>
        </div>
      </div>
    </section>
  );
}
