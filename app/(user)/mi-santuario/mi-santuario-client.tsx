"use client"
import React, { useState } from "react"
import Link from "next/link"
import { Menu, X, Play, Heart, Clock, User, LogOut, Settings, CreditCard } from "lucide-react"

export function MiSantuarioClient({ profile, stats, continueWatching, recommendedClasses }: any) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1a1a1a]">
      {/* HEADER SUPERIOR QUE TE GUSTABA */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-black/5 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="font-serif text-2xl tracking-tighter italic">SANTUARIO</div>
        
        <div className="hidden md:flex items-center gap-10 text-[10px] uppercase tracking-[0.2em] font-medium">
          <Link href="/yoga" className="hover:text-gray-400 transition-colors">Yoga</Link>
          <Link href="/meditacion" className="hover:text-gray-400 transition-colors">Meditación</Link>
          <Link href="/cursos" className="hover:text-gray-400 transition-colors">Cursos</Link>
        </div>

        <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <Menu size={20} strokeWidth={1.5} />
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL CON AIRE */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <header className="mb-20">
          <h1 className="font-serif text-6xl lg:text-7xl italic mb-4">Hola, {profile?.full_name?.split(' ')[0] || 'Oscar'}</h1>
          <p className="text-gray-400 text-xl font-light italic">Tu espacio de paz y crecimiento.</p>
        </header>

        {/* STATS CIRCULARES O LIMPIOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          {[
            { label: "Días de Conciencia", value: stats.diasConciencia },
            { label: "Minutos de Intención", value: stats.minutosIntencion },
            { label: "Prácticas", value: stats.clasesCompletadas },
          ].map((stat, i) => (
            <div key={i} className="border-t border-black/10 pt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">{stat.label}</p>
              <p className="font-serif text-5xl italic">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* CLASES RECOMENDADAS */}
        <section>
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-serif text-3xl italic">Recomendados para tu práctica</h2>
            <Link href="/clases" className="text-[10px] uppercase tracking-widest border-b border-black pb-1">Ver todo</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {recommendedClasses.map((cls: any) => (
              <div key={cls.id} className="group cursor-pointer">
                <div className="aspect-[16/10] overflow-hidden bg-gray-100 mb-6">
                  <img src={cls.thumbnail_url} alt="" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h3 className="font-serif text-2xl italic mb-2">{cls.title}</h3>
                <p className="text-[10px] uppercase tracking-widest text-gray-400">{cls.duration_minutes} MIN • {cls.instructors?.name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* MENÚ LATERAL FLOTANTE (EL QUE NO EMPUJA EL CONTENIDO) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-12 shadow-2xl animate-in slide-in-from-right duration-300">
            <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8">
              <X size={24} strokeWidth={1} />
            </button>
            
            <div className="mt-20 space-y-8 text-right">
              <Link href="/perfil" className="block font-serif text-3xl italic hover:text-gray-400 transition-colors">Perfil</Link>
              <Link href="/membresia" className="block font-serif text-3xl italic hover:text-gray-400 transition-colors">Membresía</Link>
              <Link href="/historial" className="block font-serif text-3xl italic hover:text-gray-400 transition-colors">Historial</Link>
              <Link href="/ajustes" className="block font-serif text-3xl italic hover:text-gray-400 transition-colors">Ajustes</Link>
              <button onClick={handleLogout} className="block w-full text-right font-serif text-3xl italic text-red-400 mt-20">Salir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
