"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Menu, X, User, Heart, Clock, BarChart2, LogOut, CreditCard, Settings, History } from "lucide-react"

export function MiSantuarioClient({ profile, stats, recommendedClasses }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* NAVBAR - COPIADO DE TU FOTO */}
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-8 py-12">
        <div className="flex items-center gap-20">
          <div className="font-serif text-2xl tracking-tighter font-bold uppercase">Santuario</div>
          
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            <Link href="/yoga" className="hover:text-black transition-colors">Yoga</Link>
            <Link href="/meditacion" className="hover:text-black transition-colors">Meditación</Link>
            <Link href="/fitness" className="hover:text-black transition-colors">Fitness</Link>
            <Link href="/instructores" className="hover:text-black transition-colors">Instructores</Link>
          </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
                <Link href="/mi-santuario" className="text-black border-b-2 border-black pb-1">Mi Santuario</Link>
                <Link href="/mi-practica" className="text-gray-400 hover:text-black transition-colors">Mi Práctica</Link>
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="ml-4 p-3 bg-white border border-black/5 rounded-full shadow-sm hover:shadow-md transition-all">
                <User size={20} strokeWidth={1.5} />
            </button>
        </div>
      </nav>

      {/* CUERPO CENTRAL - CON EL MARGEN DE TU FOTO */}
      <main className="max-w-[1400px] mx-auto px-8 pt-12 pb-24">
        <div className="max-w-4xl mb-24">
          <h1 className="font-serif text-[84px] leading-[1.1] mb-6 text-[#1a1a1a]">
            Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
          </h1>
          <p className="text-gray-500 text-xl font-light max-w-2xl leading-relaxed">
            Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
          </p>
        </div>

        {/* TARJETAS DE STATS - ESTILO LIMPIO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { label: "Días de Conciencia", value: stats?.diasConciencia || 0, icon: Heart },
            { label: "Minutos de Intención", value: stats?.minutosIntencion || 0, icon: Clock },
            { label: "Clases Completadas", value: stats?.clasesCompletadas || 0, icon: BarChart2 },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-black/[0.02] p-12 rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-16 text-gray-300">
                <stat.icon size={18} strokeWidth={1} />
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold">{stat.label}</span>
              </div>
              <p className="font-serif text-6xl text-[#1a1a1a]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* BOTONES REDONDEADOS ABAJO */}
        <div className="flex flex-wrap gap-4">
          <button className="px-10 py-4 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3">
            Mi Práctica <span className="text-lg">→</span>
          </button>
          <button className="px-10 py-4 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3">
            Explorar Clases <span className="text-lg">→</span>
          </button>
          <button className="px-10 py-4 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3">
            Ver Programas <span className="text-lg">→</span>
          </button>
        </div>
      </main>

      {/* MENÚ LATERAL (MODAL DERECHA) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-full max-w-[450px] bg-white h-full p-16 shadow-2xl flex flex-col">
            <button onClick={() => setIsMenuOpen(false)} className="self-end mb-20 p-2 hover:rotate-90 transition-transform">
              <X size={28} strokeWidth={1} />
            </button>
            
            <div className="space-y-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300 font-bold mb-12">Gestión de cuenta</p>
              <Link href="/perfil" className="flex items-center gap-6 text-2xl font-light hover:translate-x-2 transition-transform"><User size={20} strokeWidth={1}/> Perfil</Link>
              <Link href="/membresia" className="flex items-center gap-6 text-2xl font-light hover:translate-x-2 transition-transform"><CreditCard size={20} strokeWidth={1}/> Membresía</Link>
              <Link href="/historial" className="flex items-center gap-6 text-2xl font-light hover:translate-x-2 transition-transform"><History size={20} strokeWidth={1}/> Historial</Link>
              <Link href="/ajustes" className="flex items-center gap-6 text-2xl font-light hover:translate-x-2 transition-transform"><Settings size={20} strokeWidth={1}/> Ajustes</Link>
            </div>

            <div className="mt-auto border-t border-black/5 pt-10">
                <button onClick={() => window.location.href="/"} className="flex items-center gap-3 text-red-500 text-[10px] uppercase tracking-[0.3em] font-bold">
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
