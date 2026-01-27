"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function MiPracticaClient({ savedPrograms = [] }: { savedPrograms: any[] }) {
  const [activeTab, setActiveTab] = useState("guardados")

  return (
    <div className="min-h-screen bg-white">
      {/* Header más alto y compacto */}
      <header className="px-6 pt-10 pb-6 max-w-7xl mx-auto">
        <div className="space-y-1 mb-8">
          <h1 className="font-cormorant italic text-6xl text-zinc-900 tracking-tighter leading-none">
            Mi Santuario
          </h1>
          <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-400 font-bold">
            Tu biblioteca personal
          </p>
        </div>

        {/* Tabs minimalistas estilo Foto 2 */}
        <div className="flex gap-8 border-b border-zinc-100 pb-2">
          <button 
            onClick={() => setActiveTab("guardados")}
            className={cn(
              "text-sm font-medium transition-all relative pb-2",
              activeTab === "guardados" ? "text-zinc-900" : "text-zinc-300"
            )}
          >
            Guardados
            {activeTab === "guardados" && <div className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-zinc-900" />}
          </button>
          <button 
            onClick={() => setActiveTab("historial")}
            className={cn(
              "text-sm font-medium transition-all relative pb-2",
              activeTab === "historial" ? "text-zinc-900" : "text-zinc-300"
            )}
          >
            Historial
            {activeTab === "historial" && <div className="absolute bottom-[-9px] left-0 w-full h-[2px] bg-zinc-900" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {activeTab === "guardados" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {savedPrograms.length === 0 ? (
              <p className="font-cormorant italic text-zinc-300 text-xl">Aún no hay nada guardado aquí.</p>
            ) : (
              savedPrograms.map((item: any) => {
                const p = item.programs;
                if (!p) return null;

                return (
                  <Link key={item.id} href={`/programas/${p.slug}`} className="group block">
                    {/* Imagen con el ratio de tu foto 2 */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100 mb-6 transition-all duration-700">
                      <img 
                        src={p.thumbnail_url} 
                        alt={p.title}
                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                      />
                      {/* Puntito indicador en la esquina */}
                      <div className="absolute top-4 right-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 opacity-50" />
                      </div>
                    </div>
                    
                    {/* Texto estilo la foto que me pasaste */}
                    <div className="space-y-1">
                      <h3 className="font-cormorant italic text-4xl text-zinc-900 leading-tight">
                        {p.title}
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                        GUÍA: {p.instructors?.name}
                      </p>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        )}

        {activeTab === "historial" && (
          <div className="py-20">
            <p className="font-cormorant italic text-zinc-300 text-xl">Tu historial aparecerá aquí muy pronto.</p>
          </div>
        )}
      </main>
    </div>
  )
}
