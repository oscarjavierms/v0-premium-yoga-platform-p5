"use client"

import { UserHeader } from "@/components/layout/user-header"
import { PlayCircle, Clock, Star } from "lucide-react"

export default function MiSantuarioPage() {
  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header para usuarios logueados */}
      <UserHeader />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-black/40 block mb-2">Tu espacio personal</span>
            <h1 className="font-serif text-5xl text-black">Mi Santuario</h1>
          </div>
          <p className="text-black/60 italic font-light max-w-md border-l border-black/10 pl-6">
            "La paz no es algo que encuentras, es algo que creas dentro de ti."
          </p>
        </div>

        {/* Sección de clases destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group bg-white rounded-3xl overflow-hidden border border-black/[0.03] hover:shadow-2xl hover:shadow-black/5 transition-all duration-500">
              <div className="aspect-[16/10] bg-gray-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1 text-[9px] tracking-widest uppercase font-bold text-black/40">
                    <Clock size={12} /> 45 MIN
                  </span>
                  <span className="flex items-center gap-1 text-[9px] tracking-widest uppercase font-bold text-black/40">
                    <Star size={12} /> INTERMEDIO
                  </span>
                </div>
                <h3 className="font-serif text-xl mb-2 text-black group-hover:text-black/60 transition-colors">Vinyasa Flow: Apertura de Corazón</h3>
                <p className="text-sm text-black/40 font-light leading-relaxed">Una sesión diseñada para liberar tensiones y cultivar la gratitud.</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
