"use client"
import { Heart, Clock, BarChart2, ChevronRight } from "lucide-react"
import Link from "next/link"

export function MiSantuarioClient({ profile, stats }: any) {
  return (
    <main className="max-w-[1400px] mx-auto px-10 pt-16 pb-32">
      <div className="max-w-4xl mb-24">
        <h1 className="font-serif text-[90px] leading-[1] mb-8 tracking-tight text-[#1a1a1a]">
          Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
        </h1>
        <p className="text-gray-500 text-2xl font-light max-w-2xl leading-relaxed italic">
          Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
        </p>
      </div>

      {/* STATS - Con el interlineado y sombras de la captura exitosa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          { label: "Días de Conciencia", value: stats?.diasConciencia || 12, icon: Heart },
          { label: "Minutos de Intención", value: stats?.minutosIntencion || 450, icon: Clock },
          { label: "Clases Completadas", value: stats?.clasesCompletadas || 8, icon: BarChart2 },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-black/[0.03] p-14 rounded-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-4 mb-20 text-gray-300">
              <stat.icon size={20} strokeWidth={1} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">{stat.label}</span>
            </div>
            <p className="font-serif text-7xl italic text-[#1a1a1a]">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-5">
        <Link href="/mi-practica" className="px-10 py-5 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
          Mi Práctica <ChevronRight size={14} />
        </Link>
        <Link href="/clases" className="px-10 py-5 bg-white border border-black/5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold shadow-sm hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
          Explorar Clases <ChevronRight size={14} />
        </Link>
      </div>
    </main>
  )
}
