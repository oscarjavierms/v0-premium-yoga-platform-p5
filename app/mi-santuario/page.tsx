import React from "react"
import { Play, Calendar, Star, ArrowRight } from "lucide-react"

export default function MiSantuario() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1a1a1a] pb-20">
      {/* Header de Bienvenida */}
      <header className="pt-24 pb-16 px-8 max-w-6xl mx-auto">
        <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 mb-4 block">
          Espacio Personal
        </span>
        <h1 className="font-serif text-5xl md:text-6xl italic font-light tracking-tight">
          Hola, Oscar
        </h1>
        <p className="mt-6 text-gray-500 font-light max-w-md leading-relaxed">
          Bienvenido a tu santuario de paz. Tu práctica te espera para encontrar el equilibrio hoy.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-8 space-y-24">
        
        {/* Sección: Continuar Práctica (Clase Principal) */}
        <section>
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-sm uppercase tracking-widest font-bold">Tu última sesión</h2>
            </div>
          </div>
          
          <div className="relative aspect-[21/9] w-full bg-gray-100 overflow-hidden rounded-sm group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              alt="Clase de Yoga"
            />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                <Play fill="white" size={20} className="ml-1" />
              </div>
              <h3 className="mt-6 font-serif text-3xl italic">Vinyasa Flow: Apertura de Corazón</h3>
              <p className="text-xs tracking-[0.2em] uppercase mt-2 opacity-80">45 Minutos • Nivel Intermedio</p>
            </div>
          </div>
        </section>

        {/* Grid de Secciones */}
        <div className="grid md:grid-cols-2 gap-16">
          
          {/* Próximas Clases */}
          <section className="space-y-6">
            <h2 className="text-sm uppercase tracking-widest font-bold border-b border-black/5 pb-4">Próximos Encuentros</h2>
            <div className="space-y-8">
              {[
                { dia: "Mañana", clase: "Meditación Guiada", hora: "07:00 AM" },
                { dia: "Viernes", clase: "Hatha Yoga Suave", hora: "06:30 PM" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <div>
                    <p className="text-[10px] uppercase tracking-tighter text-gray-400">{item.dia}</p>
                    <p className="font-serif text-xl italic group-hover:translate-x-2 transition-transform">{item.clase}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light text-gray-500">{item.hora}</p>
                    <ArrowRight size={14} className="ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Estadísticas / Logros Minimalistas */}
          <section className="space-y-6">
            <h2 className="text-sm uppercase tracking-widest font-bold border-b border-black/5 pb-4">Tu Progreso</h2>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="text-center p-8 border border-black/5 rounded-sm">
                <p className="text-4xl font-serif italic">12</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Días seguidos</p>
              </div>
              <div className="text-center p-8 border border-black/5 rounded-sm">
                <p className="text-4xl font-serif italic">125</p>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-2">Horas totales</p>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  )
}
