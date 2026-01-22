"use client"
import { Heart, Clock } from "lucide-react"

export function MiSantuarioClient({ profile, stats }: any) {
  return (
    <main className="max-w-[1400px] mx-auto px-10 pt-16 pb-24">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
        {/* SALUDO */}
        <div className="max-w-xl">
          <h1 className="font-serif text-[72px] leading-[1.1] mb-6 text-[#1a1a1a]">
            Hola, {profile?.full_name?.split(' ')[0] || 'oscar'}.
          </h1>
          <p className="text-gray-500 text-lg font-light leading-relaxed">
            Tu espacio de bienestar te espera, espacio de paz.
          </p>
        </div>

        {/* TARJETAS DE STATS */}
        <div className="flex gap-6">
          <div className="bg-white border border-black/[0.03] p-10 rounded-2xl shadow-sm w-72">
            <div className="flex items-center gap-3 mb-10 text-gray-400">
              <Heart size={16} strokeWidth={1.5} />
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold">DÍAS DE CONCIENCIA</span>
            </div>
            <p className="font-serif text-5xl">{stats?.diasConciencia || 0}</p>
          </div>
          <div className="bg-white border border-black/[0.03] p-10 rounded-2xl shadow-sm w-72">
            <div className="flex items-center gap-3 mb-10 text-gray-400">
              <Clock size={16} strokeWidth={1.5} />
              <span className="text-[9px] uppercase tracking-[0.2em] font-bold">MINUTOS DE PRÁCTICA</span>
            </div>
            <p className="font-serif text-5xl">{stats?.minutosIntencion || 0}</p>
          </div>
        </div>
      </div>

      {/* SECCIÓN RECOMENDADOS */}
      <section className="mt-32">
        <h2 className="font-serif text-2xl mb-12">Recomendados para ti</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/5] bg-gray-100/50 rounded-xl border border-black/[0.02] flex items-center justify-center">
              <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-gray-400 italic">
                {i}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
