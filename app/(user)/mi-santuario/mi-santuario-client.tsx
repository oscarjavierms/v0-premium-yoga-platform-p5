"use client"
import { Heart, Clock, BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"

export function MiSantuarioClient({ profile, stats }: any) {
  return (
    <div className="max-w-[1400px] mx-auto px-10 py-16 bg-white min-h-screen">
      {/* Saludo Estilo Editorial */}
      <div className="max-w-4xl mb-24">
        <h1 className="font-serif text-[84px] leading-[1] mb-6 tracking-tight text-black">
          Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
        </h1>
        <p className="text-black/50 text-xl font-light italic">
          Tu espacio de bienestar te espera. Cada práctica es un paso hacia tu mejor versión.
        </p>
      </div>

      {/* Tarjetas con números en itálica (Diseño 125k) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <div className="bg-white border border-black/5 p-12 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4 mb-16 text-black/20">
            <Heart size={18} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">DÍAS DE CONCIENCIA</span>
          </div>
          <p className="font-serif text-7xl italic leading-none text-black">{stats?.diasConciencia || 12}</p>
        </div>

        <div className="bg-white border border-black/5 p-12 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4 mb-16 text-black/20">
            <Clock size={18} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">MINUTOS DE INTENCIÓN</span>
          </div>
          <p className="font-serif text-7xl italic leading-none text-black">{stats?.minutosIntencion || 450}</p>
        </div>

        <div className="bg-white border border-black/5 p-12 rounded-3xl shadow-sm">
          <div className="flex items-center gap-4 mb-16 text-black/20">
            <BookOpen size={18} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-black/40">CLASES COMPLETADAS</span>
          </div>
          <p className="font-serif text-7xl italic leading-none text-black">{stats?.clasesCompletadas || 8}</p>
        </div>
      </div>

      {/* Botones Cápsula */}
      <div className="flex flex-wrap gap-4">
        <Link href="/mi-practica" className="px-10 py-4 bg-white border border-black/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
          Mi Práctica <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/clases" className="px-10 py-4 bg-white border border-black/10 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-black hover:text-white transition-all flex items-center gap-3 group">
          Explorar Clases <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )
}
