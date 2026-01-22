"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Menu, X, User, Heart, Clock, BarChart2, LogOut, ChevronRight } from "lucide-react"

export function MiSantuarioClient({ profile, stats }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1a1a1a] selection:bg-black/5">
      {/* NAVBAR - DISEÑO FOTO 10 */}
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-10 py-12">
        {/* LOGO IZQUIERDA */}
        <div className="font-serif text-2xl tracking-tighter font-black uppercase">
          Santuario
        </div>
        
        {/* MENÚ CENTRAL */}
        <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400">
          <Link href="/yoga" className="hover:text-black transition-colors">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black transition-colors">Meditación</Link>
          <Link href="/fitness" className="hover:text-black transition-colors">Fitness</Link>
          <Link href="/instructores" className="hover:text-black transition-colors">Instructores</Link>
        </div>

        {/* NAVEGACIÓN DERECHA */}
        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] font-bold">
            <Link href="/mi-santuario" className="text-black border-b-2 border-black pb-1">Mi Santuario</Link>
            <Link href="/mi-practica" className="text-gray-400 hover:text-black transition-colors">Mi Práctica</Link>
          </div>
          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="w-12 h-12 flex items-center justify-center bg-white border border-black/5 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <User size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-[1400px] mx-auto px-10 pt-16 pb-32">
        <div className="max-w-4xl mb-24">
          <h1 className="font-serif text-[90px] leading-[1] mb-8 tracking-tight text-[#1a1a1a]">
            Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
          </h1>
          <p className="text-gray-500 text-2xl font-light max-w-2xl leading-relaxed">
            Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
          </p>
        </div>

        {/* TARJETAS DE STATS - ESTILO FOTO 10 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {[
            { label: "Días de Conciencia", value: stats?.diasConciencia || 12, icon: Heart },
            { label: "Minutos de Intención", value: stats?.minutosIntencion || 450, icon: Clock },
            { label: "Clases Completadas", value: stats?.clasesCompletadas || 8, icon: BarChart2 },
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-black/[0.03] p-14 rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:translate-y-[-4px] transition-transform">
              <div className="flex items-center gap-4 mb-20 text-gray-300">
                <stat.icon size={20} strokeWidth={1} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{stat.label}</span>
              </div>
              <p className="font-serif text-7xl italic text-[#1a1a1a]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* BOTONES DE ACCIÓN - REDONDOS CON FLECHA */}
        <div className="flex flex-wrap gap-5">
          <Link href="/mi-practica" className="px-10 py-5 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
            Mi Práctica <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/clases" className="px-10 py-5 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
            Explorar Clases <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/programas" className="px-10 py-5 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
            Ver Programas <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* MENÚ LATERAL QUE NO DAÑA EL DISEÑO */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/5 backdrop-blur-md" onClick={() => setIsMenuOpen(false)} />
          <div className="relative w-full max-w-[450px] bg-white h-full p-20 shadow-2xl flex flex-col">
            <button onClick={() => setIsMenuOpen(false)} className="self-end mb-24 p-2 hover:rotate-90 transition-transform">
              <X size={32} strokeWidth={1} />
            </button>
            <div className="space-y-12">
              <p className="text-[10px] uppercase tracking-[0.4em] text-gray-300 font-bold mb-16">Cuenta Premium</p>
              <Link href="/perfil" className="block text-4xl font-serif italic hover:translate-x-4 transition-transform">Perfil</Link>
              <Link href="/membresia" className="block text-4xl font-serif italic hover:translate-x-4 transition-transform">Membresía</Link>
              <Link href="/ajustes" className="block text-4xl font-serif italic hover:translate-x-4 transition-transform">Ajustes</Link>
              <button onClick={() => window.location.href="/"} className="flex items-center gap-4 text-red-400 text-[10px] uppercase tracking-[0.4em] font-bold pt-20 border-t border-black/5 w-full">
                <LogOut size={18} /> Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
