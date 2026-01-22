"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Menu, X, User, Heart, Clock, BarChart2, LogOut } from "lucide-react"

export function MiSantuarioClient({ profile, stats }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1a1a1a]">
      {/* HEADER DE LA FOTO 10 */}
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-10">
        <div className="flex items-center gap-16">
          <div className="font-serif text-2xl tracking-tighter font-bold uppercase">Santuario</div>
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            <span className="cursor-pointer hover:text-black">Yoga</span>
            <span className="cursor-pointer hover:text-black">Meditación</span>
            <span className="cursor-pointer hover:text-black">Fitness</span>
            <span className="cursor-pointer hover:text-black">Instructores</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
            <Link href="/mi-santuario" className="text-black border-b-2 border-black pb-1">Mi Santuario</Link>
            <span className="text-gray-400 cursor-pointer">Mi Práctica</span>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="p-3 bg-white border border-black/5 rounded-full shadow-sm">
            <User size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-[1400px] mx-auto px-8 pt-16 pb-24">
        <div className="max-w-4xl mb-24">
          <h1 className="font-serif text-[84px] leading-[1.1] mb-6 tracking-tight">
            Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
          </h1>
          <p className="text-gray-500 text-xl font-light max-w-2xl italic">
            Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
          </p>
        </div>

        {/* TARJETAS DE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Días de Conciencia", value: stats.diasConciencia, icon: Heart },
            { label: "Minutos de Intención", value: stats.minutosIntencion, icon: Clock },
            { label: "Clases Completadas", value: stats.clasesCompletadas, icon: BarChart2 },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-black/[0.03] p-12 rounded-xl shadow-sm">
              <div className="flex items-center gap-3 mb-16 text-gray-300">
                <stat.icon size={18} strokeWidth={1} />
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold">{stat.label}</span>
              </div>
              <p className="font-serif text-6xl italic">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* BOTONES REDONDOS */}
        <div className="flex flex-wrap gap-4">
          <button className="px-10 py-4 bg-white border border-black/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">
            Mi Práctica →
          </button>
          <button className="px-10 py-4 bg-white border border-black/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">
            Explorar Clases →
          </button>
        </div>
      </main>

      {/* MENÚ LATERAL (OVERLAY) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-[400px] bg-white h-full p-16 shadow-2xl flex flex-col">
            <button onClick={() => setIsMenuOpen(false)} className="self-end mb-20">
              <X size={28} strokeWidth={1} />
            </button>
            <div className="space-y-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300 font-bold mb-12">Menú</p>
              <span className="block text-2xl font-light cursor-pointer">Perfil</span>
              <span className="block text-2xl font-light cursor-pointer">Membresía</span>
              <span className="block text-2xl font-light cursor-pointer">Ajustes</span>
              <button onClick={() => window.location.href="/"} className="flex items-center gap-3 text-red-500 text-[10px] uppercase tracking-[0.3em] font-bold mt-20">
                <LogOut size={16} /> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
