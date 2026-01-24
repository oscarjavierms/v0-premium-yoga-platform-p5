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
      {/* EL TRUCO: 'object-cover' elimina las barras negras y llena la pantalla */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Capa oscura para que el texto resalte sobre el video */}
      <div className="absolute inset-0 bg-black/30" />

      {/* TEXTO: Con la misma altura que Yoga (pb-[40vh]) */}
      <div className="relative h-full flex flex-col items-center justify-end text-center px-6 pb-[40vh] md:pb-48">
        <div className="space-y-6">
          <h1 className="font-serif text-5xl md:text-8xl text-white tracking-[0.2em] uppercase drop-shadow-2xl">
            {title}
          </h1>
          {subtitle && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="hidden md:block w-12 h-px bg-white/40" />
              <p className="font-sans text-white/90 text-[10px] md:text-xs tracking-[0.4em] md:tracking-[0.6em] uppercase font-light max-w-[280px] md:max-w-2xl leading-relaxed">
                {subtitle}
              </p>
              <div className="hidden md:block w-12 h-px bg-white/40" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
