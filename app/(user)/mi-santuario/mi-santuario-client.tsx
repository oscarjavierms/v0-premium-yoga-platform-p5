"use client"

import React from "react"
import { Play, Clock, BarChart2, Heart } from "lucide-react"

interface MiSantuarioClientProps {
  profile: any
  stats: {
    diasConciencia: number
    minutosIntencion: number
    clasesCompletadas: number
  }
  continueWatching: any
  recommendedClasses: any[]
}

export function MiSantuarioClient({ profile, stats, continueWatching, recommendedClasses }: MiSantuarioClientProps) {
  return (
    <div className="p-8 lg:p-12 space-y-12 bg-[#FDFCFB]">
      {/* BIENVENIDA LIMPIA */}
      <header>
        <h1 className="font-serif text-4xl lg:text-5xl italic text-gray-900 mb-2">
          Hola, {profile?.full_name?.split(' ')[0] || 'Oscar'}
        </h1>
        <p className="text-gray-500 font-light text-lg italic">Bienvenido de vuelta a tu espacio de paz.</p>
      </header>

      {/* STATS MINIMALISTAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Días de Conciencia", value: stats.diasConciencia, icon: Heart },
          { label: "Minutos de Intención", value: stats.minutosIntencion, icon: Clock },
          { label: "Prácticas Completas", value: stats.clasesCompletadas, icon: BarChart2 },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-black/5 p-6 rounded-sm shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-gray-400">
              <stat.icon size={18} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className="font-serif text-3xl italic">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* CONTINUAR PRACTICANDO */}
      {continueWatching && (
        <section>
          <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Continuar Practicando</h2>
          <div className="group relative bg-white border border-black/5 rounded-sm overflow-hidden flex flex-col md:flex-row shadow-sm hover:shadow-md transition-shadow">
            <div className="md:w-1/3 aspect-video bg-gray-100">
              <img src={continueWatching.classes.thumbnail_url} alt="" className="object-cover w-full h-full" />
            </div>
            <div className="p-6 flex flex-col justify-center">
              <h3 className="font-serif text-2xl italic mb-2">{continueWatching.classes.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{continueWatching.classes.duration_minutes} minutos • {continueWatching.classes.pillar}</p>
              <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium hover:text-gray-600 transition-colors">
                <Play size={14} fill="currentColor" /> Reanudar Sesión
              </button>
            </div>
          </div>
        </section>
      )}

      {/* RECOMENDADOS */}
      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-6">Recomendados para ti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedClasses.map((cls) => (
            <div key={cls.id} className="group cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden bg-gray-100 mb-4 relative">
                <img src={cls.thumbnail_url} alt={cls.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <h3 className="font-serif text-xl italic mb-1 group-hover:text-gray-600">{cls.title}</h3>
              <p className="text-[10px] uppercase tracking-widest text-gray-400">{cls.duration_minutes} min • {cls.instructors?.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
