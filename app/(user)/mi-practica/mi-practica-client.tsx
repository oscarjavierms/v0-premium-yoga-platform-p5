"use client"

import Link from "next/link"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function MiPracticaClient({ savedPrograms = [] }: { savedPrograms: any[] }) {
  const [activeTab, setActiveTab] = useState("guardados")

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-32">
        {/* ENCABEZADO: Sincronizado con YogaPage pero con tus títulos */}
        <header className="mb-12">
          <h1 className="text-5xl font-cormorant text-zinc-900 mb-2">Mi Santuario</h1>
          <p className="text-zinc-500 font-light italic text-lg">Tu biblioteca personal de introspección</p>
        </header>

        {/* TABS ESTILO MINIMALISTA */}
        <div className="flex gap-8 border-b border-zinc-100 mb-12 pb-2">
          <button 
            onClick={() => setActiveTab("guardados")}
            className={cn(
              "text-[11px] uppercase tracking-[0.2em] font-medium transition-all relative pb-2",
              activeTab === "guardados" ? "text-zinc-900" : "text-zinc-300"
            )}
          >
            Guardados ({savedPrograms.length})
            {activeTab === "guardados" && <div className="absolute bottom-[-10px] left-0 w-full h-[1.5px] bg-zinc-900" />}
          </button>
          <button 
            onClick={() => setActiveTab("historial")}
            className={cn(
              "text-[11px] uppercase tracking-[0.2em] font-medium transition-all relative pb-2",
              activeTab === "historial" ? "text-zinc-900" : "text-zinc-300"
            )}
          >
            Historial
            {activeTab === "historial" && <div className="absolute bottom-[-10px] left-0 w-full h-[1.5px] bg-zinc-900" />}
          </button>
        </div>

        {activeTab === "guardados" && (
          <>
            {savedPrograms && savedPrograms.length > 0 ? (
              /* GRILLA CLONADA DE YOGA PAGE */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
                {savedPrograms.map((item: any) => {
                  const program = item.programs;
                  if (!program) return null;

                  return (
                    <Link 
                      href={`/programas/${program.slug}`} 
                      key={item.id} 
                      className="group flex flex-col gap-4"
                    >
                      {/* Thumbnail / Portada: Mismo estilo que Yoga */}
                      <div className="aspect-video bg-zinc-100 rounded-sm overflow-hidden relative border border-zinc-100 transition-all group-hover:shadow-md">
                        {program.thumbnail_url ? (
                          <img 
                            src={program.thumbnail_url} 
                            alt={program.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-50">
                            <span className="text-[10px] tracking-[0.3em] text-zinc-300 uppercase font-bold">
                              Santuario Program
                            </span>
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-medium uppercase tracking-widest">
                          Program
                        </div>
                      </div>

                      {/* Información: Mismas clases de CSS que Yoga Page */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-medium text-zinc-900 leading-tight group-hover:text-zinc-500 transition-colors">
                          {program.title}
                        </h3>
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-light tracking-wide uppercase">
                          <span>{program.instructors?.name || "Instructor"}</span>
                          <span className="flex items-center gap-1.5 uppercase tracking-widest">
                            <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                            {program.experience_type || "Yoga"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center border-t border-zinc-50">
                <p className="font-cormorant italic text-zinc-300 text-2xl">
                  Tu santuario está esperando ser llenado...
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === "historial" && (
          <div className="py-20 text-center border-t border-zinc-50">
            <p className="font-cormorant italic text-zinc-300 text-2xl">
              Próximamente tu historial de práctica...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
