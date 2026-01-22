"use client"
import React from "react"
import { Heart, Clock, BookOpen } from "lucide-react"

export function MiSantuarioClient({ profile, stats }: any) {
  return (
    <div className="max-w-[1400px] mx-auto px-10 py-16 bg-white min-h-screen text-black">
      <div className="max-w-4xl mb-20">
        <h1 className="font-serif text-[64px] leading-tight mb-4">
          Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
        </h1>
        <p className="text-black/50 text-xl font-light italic">Tu espacio de bienestar.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white border border-black/5 p-10 rounded-3xl shadow-sm">
          <Heart className="mb-8 opacity-20" size={24} />
          <span className="text-[10px] uppercase tracking-widest font-bold block mb-4 text-black/40">Días</span>
          <p className="font-serif text-6xl italic">{stats?.diasConciencia || 0}</p>
        </div>
        <div className="bg-white border border-black/5 p-10 rounded-3xl shadow-sm">
          <Clock className="mb-8 opacity-20" size={24} />
          <span className="text-[10px] uppercase tracking-widest font-bold block mb-4 text-black/40">Minutos</span>
          <p className="font-serif text-6xl italic">{stats?.minutosIntencion || 0}</p>
        </div>
        <div className="bg-white border border-black/5 p-10 rounded-3xl shadow-sm">
          <BookOpen className="mb-8 opacity-20" size={24} />
          <span className="text-[10px] uppercase tracking-widest font-bold block mb-4 text-black/40">Clases</span>
          <p className="font-serif text-6xl italic">{stats?.clasesCompletadas || 0}</p>
        </div>
      </div>
    </div>
  )
}
