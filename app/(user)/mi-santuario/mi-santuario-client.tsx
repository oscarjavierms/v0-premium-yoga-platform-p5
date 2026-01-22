"use client"
import { Heart, Clock, BarChart2, ChevronRight } from "lucide-react"
import Link from "next/link"

export function MiSantuarioClient({ profile, stats }: any) {
  return (
    <main className="max-w-[1400px] mx-auto px-10 pt-16 pb-24">
      <div className="max-w-4xl mb-24">
        {/* Tamaño original de la foto de éxito */}
        <h1 className="font-serif text-[84px] leading-[1.1] mb-6 text-[#1a1a1a]">
          Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
        </h1>
        <p className="text-gray-500 text-xl font-light max-w-2xl leading-relaxed">
          Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
        </p>
      </div>

      {/* TARJETAS CON EL ESTILO ORIGINAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {[
          { label: "Días de Conciencia", value: stats?.diasConciencia || 12, icon: Heart },
          { label: "Minutos de Intención", value: stats?.minutosIntencion || 450, icon: Clock },
          { label: "Clases Completadas", value: stats?.clasesCompletadas || 8, icon: BarChart2 },
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

      {/* BOTONES REDONDEADOS CON FLECHA */}
      <div className="flex flex-wrap gap-4">
        <Link href="/mi-practica" className="px-10 py-4 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
          Mi Práctica <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/clases" className="px-10 py-4 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
          Explorar Clases <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </main>
  )
}
