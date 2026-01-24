"use client"

import React from 'react';

interface SectionHeroVideoProps {
  title: string;
  subtitle?: string;
  videoUrl: string;
}

export function SectionHeroVideo({ title, subtitle, videoUrl }: SectionHeroVideoProps) {
  return (
    <section className="relative w-full h-[100vh] overflow-hidden bg-black">
      {/* EL TRUCO: object-cover hace que el video llene toda la pantalla sin bordes negros */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Capa de contraste */}
      <div className="absolute inset-0 bg-black/20" />

      {/* TEXTO: Con la misma altura que arreglamos para el móvil */}
      <div className="relative h-full flex flex-col items-center justify-end text-center px-6 pb-[40vh] md:pb-48">
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-8xl text-white tracking-[0.2em] uppercase drop-shadow-2xl">
            {title}
          </h1>
          {subtitle && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="hidden md:block w-12 h-px bg-white/40" />
              <p className="font-sans text-white/90 text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] uppercase font-light max-w-[280px] md:max-w-2xl">
                {subtitle}
              </p>
              <div className="hidden md:block w-12 h-px bg-white/40" />
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20">
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </section>
  );
}
