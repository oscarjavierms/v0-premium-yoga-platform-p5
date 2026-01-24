"use client"

import React from 'react';

interface SectionHeroVideoProps {
  title: string;
  subtitle?: string;
  videoUrl: string;
}

export function SectionHeroVideo({ title, subtitle, videoUrl }: SectionHeroVideoProps) {
  return (
    /* -mt-[80px] o -mt-20: Esto empuja el video hacia arriba para que quede detrás del header */
    /* h-screen asegura que ocupe toda la pantalla disponible */
    <section className="relative w-full h-screen overflow-hidden bg-black -mt-[80px] md:-mt-[112px]">
      
      <video
        autoPlay
        loop
        muted
        playsInline
        /* object-cover: fundamental para que no queden espacios negros */
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Overlay oscuro para que el texto blanco se lea bien sobre el video */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenido del texto */}
      <div className="relative h-full flex flex-col items-center justify-end text-center px-6 pb-[30vh] md:pb-48">
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-8xl text-white tracking-[0.2em] uppercase drop-shadow-2xl">
            {title}
          </h1>
          {subtitle && (
            <p className="font-sans text-white/90 text-[10px] md:text-xs tracking-[0.6em] uppercase font-light">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
