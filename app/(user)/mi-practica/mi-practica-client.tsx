"use client"

import Link from "next/link"

export function MiPracticaClient({ savedPrograms = [] }: { savedPrograms: any[] }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Compacto */}
      <header className="px-6 pt-16 pb-8 max-w-7xl mx-auto border-b border-zinc-100">
        <h1 className="font-cormorant italic text-6xl text-zinc-900 tracking-tighter">Mi Santuario</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 mt-3 font-bold">Tu biblioteca personal</p>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {savedPrograms.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-cormorant italic text-zinc-300 text-2xl mb-6">Aún no hay nada guardado aquí.</p>
            <Link href="/explorar" className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 underline underline-offset-8">Explorar</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {savedPrograms.map((item: any) => {
              const p = item.programs;
              if (!p) return null;

              return (
                <Link key={item.id} href={`/programas/${p.slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 mb-6 shadow-sm transition-all duration-700 group-hover:shadow-2xl">
                    <img 
                      src={p.thumbnail_url} 
                      alt={p.title}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-0 right-0 p-4">
                       <div className="w-2 h-2 rounded-full bg-zinc-900 animate-pulse" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-cormorant italic text-4xl text-zinc-900 leading-none group-hover:text-zinc-500 transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                      Guía: {p.instructors?.name}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
