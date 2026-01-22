"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Menu, X, User, LogOut, Settings, CreditCard, Heart, Clock, BarChart2 } from "lucide-react"

export function MiSantuarioClient({ profile, stats, recommendedClasses }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* HEADER SUPERIOR (DE TU FOTO 1) */}
      <nav className="flex items-center justify-between px-10 py-8 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="font-serif text-2xl tracking-tight font-bold">SANTUARIO</div>
        
        <div className="hidden lg:flex items-center gap-12 text-[10px] uppercase tracking-[0.2em] font-medium text-gray-500">
          <Link href="/yoga" className="hover:text-black">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black">Meditación</Link>
          <Link href="/fitness" className="hover:text-black">Fitness</Link>
          <Link href="/instructores" className="hover:text-black">Instructores</Link>
          <span className="w-[1px] h-4 bg-gray-200 mx-2"></span>
          <Link href="/mi-santuario" className="text-black border-b border-black pb-1">Mi Santuario</Link>
          <Link href="/mi-practica" className="hover:text-black">Mi Práctica</Link>
        </div>

        <button onClick={() => setIsMenuOpen(true)} className="p-2 border border-black/5 rounded-full hover:bg-black/5 transition-all">
          <User size={20} strokeWidth={1} />
        </button>
      </nav>

      {/* CUERPO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-10 py-20">
        <header className="mb-24">
          <h1 className="font-serif text-7xl italic mb-6">Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.</h1>
          <p className="text-gray-500 text-xl font-light max-w-2xl leading-relaxed">
            Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
          </p>
        </header>

        {/* STATS (TUS TARJETAS BLANCAS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { label: "Días de Conciencia", value: stats.diasConciencia, icon: Heart },
            { label: "Minutos de Intención", value: stats.minutosIntencion, icon: Clock },
            { label: "Clases Completadas", value: stats.clasesCompletadas, icon: BarChart2 },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-black/[0.03] p-10 rounded-sm shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-3 mb-10 text-gray-400">
                <stat.icon size={16} strokeWidth={1.5} />
                <span className="text-[10px] uppercase tracking-widest">{stat.label}</span>
              </div>
              <p className="font-serif text-5xl italic">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* BOTONES DE ACCIÓN RÁPIDA (DE TU FOTO 1) */}
        <div className="flex flex-wrap gap-4">
          <button className="px-8 py-3 border border-black/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Mi Práctica →</button>
          <button className="px-8 py-3 border border-black/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Explorar Clases →</button>
          <button className="px-8 py-3 border border-black/10 rounded-full text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Ver Programas →</button>
        </div>
      </main>

      {/* MENÚ DE USUARIO (DERECHA) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-12 shadow-2xl animate-in slide-in-from-right duration-500">
            <button onClick={() => setIsMenuOpen(false)} className="mb-16 hover:rotate-90 transition-transform">
              <X size={24} strokeWidth={1} />
            </button>
            <div className="space-y-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-10">Gestión de cuenta</p>
              <Link href="/perfil" className="flex items-center gap-4 font-light text-lg hover:translate-x-2 transition-transform"><User size={18}/> Perfil</Link>
              <Link href="/membresia" className="flex items-center gap-4 font-light text-lg hover:translate-x-2 transition-transform"><CreditCard size={18}/> Membresía</Link>
              <Link href="/historial" className="flex items-center gap-4 font-light text-lg hover:translate-x-2 transition-transform"><Clock size={18}/> Historial</Link>
              <Link href="/ajustes" className="flex items-center gap-4 font-light text-lg hover:translate-x-2 transition-transform"><Settings size={18}/> Ajustes</Link>
              <button onClick={() => window.location.href="/"} className="flex items-center gap-4 font-light text-lg text-red-400 pt-10 border-t border-black/5 w-full"><LogOut size={18}/> Cerrar Sesión</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
