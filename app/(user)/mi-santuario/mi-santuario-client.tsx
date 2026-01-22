"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Menu, X, User, Heart, Clock, BarChart2, LogOut, CreditCard, Settings, History } from "lucide-react"

export function MiSantuarioClient({ profile, stats, recommendedClasses }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="relative">
      {/* NAVBAR SUPERIOR - EL QUE TE GUSTA */}
      <nav className="flex items-center justify-between px-8 py-10 bg-transparent">
        <div className="font-serif text-2xl tracking-tighter font-bold uppercase">Santuario</div>
        
        <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-semibold text-gray-400">
          <Link href="/yoga" className="hover:text-black transition-colors">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black transition-colors">Meditación</Link>
          <Link href="/fitness" className="hover:text-black transition-colors">Fitness</Link>
          <Link href="/instructores" className="hover:text-black transition-colors">Instructores</Link>
          <span className="w-[1px] h-3 bg-gray-200"></span>
          <Link href="/mi-santuario" className="text-black border-b border-black pb-1">Mi Santuario</Link>
          <Link href="/mi-practica" className="hover:text-black transition-colors">Mi Práctica</Link>
        </div>

        <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-black/5 rounded-full transition-all">
          <Menu size={24} strokeWidth={1} />
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL (HERO) */}
      <main className="max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="max-w-3xl mb-24">
          <h1 className="font-serif text-[80px] leading-[0.9] italic mb-8 text-[#1a1a1a]">
            Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
          </h1>
          <p className="text-gray-500 text-xl font-light italic leading-relaxed">
            Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
          </p>
        </div>

        {/* TARJETAS DE STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { label: "Días de Conciencia", value: stats?.diasConciencia || 0, icon: Heart },
            { label: "Minutos de Intención", value: stats?.minutosIntencion || 0, icon: Clock },
            { label: "Clases Completadas", value: stats?.clasesCompletadas || 0, icon: BarChart2 },
          ].map((stat, i) => (
            <div key={i} className="bg-white/40 border border-black/[0.03] p-12 rounded-sm backdrop-blur-sm shadow-sm">
              <div className="flex items-center gap-3 mb-12 text-gray-400">
                <stat.icon size={16} strokeWidth={1.5} />
                <span className="text-[9px] uppercase tracking-[0.2em]">{stat.label}</span>
              </div>
              <p className="font-serif text-6xl italic text-[#1a1a1a]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* BOTONES DE ACCIÓN RÁPIDA */}
        <div className="flex flex-wrap gap-4">
          <button className="px-10 py-4 border border-black/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">Mi Práctica →</button>
          <button className="px-10 py-4 border border-black/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">Explorar Clases →</button>
          <button className="px-10 py-4 border border-black/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all">Ver Programas →</button>
        </div>
      </main>

      {/* MENÚ LATERAL QUE APARECE DESDE LA DERECHA */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[400px] bg-white p-16 shadow-2xl flex flex-col justify-between">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-10 right-10 hover:rotate-90 transition-transform">
              <X size={30} strokeWidth={1} />
            </button>
            
            <div className="space-y-12 mt-20">
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-300 font-bold mb-16">Gestión de cuenta</p>
              <Link href="/perfil" className="group flex items-center gap-6 font-serif text-4xl italic hover:translate-x-4 transition-transform"><User size={24} strokeWidth={1}/> Perfil</Link>
              <Link href="/membresia" className="group flex items-center gap-6 font-serif text-4xl italic hover:translate-x-4 transition-transform"><CreditCard size={24} strokeWidth={1}/> Membresía</Link>
              <Link href="/historial" className="group flex items-center gap-6 font-serif text-4xl italic hover:translate-x-4 transition-transform"><History size={24} strokeWidth={1}/> Historial</Link>
              <Link href="/ajustes" className="group flex items-center gap-6 font-serif text-4xl italic hover:translate-x-4 transition-transform"><Settings size={24} strokeWidth={1}/> Ajustes</Link>
            </div>

            <button onClick={() => window.location.href="/"} className="flex items-center gap-4 text-red-400 font-bold text-[10px] uppercase tracking-[0.3em] hover:text-red-600 transition-colors">
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
