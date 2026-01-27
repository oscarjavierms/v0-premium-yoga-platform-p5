"use client"

import { useState } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function MiPracticaClient({ savedPrograms = [] }: { savedPrograms: any[] }) {
  const [activeTab, setActiveTab] = useState("guardados")

  return (
    <div className="min-h-screen bg-white">
      {/* Header más ajustado */}
      <header className="px-6 py-12 border-b border-zinc-50 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="font-cormorant italic text-5xl text-zinc-900 tracking-tighter">Mi Santuario</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Tu biblioteca personal de introspección</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-zinc-50 p-1 rounded-none border border-zinc-100">
            <TabsTrigger value="guardados" className="rounded-none text-[9px] uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
              Guardados ({savedPrograms.length})
            </TabsTrigger>
            <TabsTrigger value="historial" className="rounded-none text-[9px] uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
              Historial (0)
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <TabsContent value="guardados" className="mt-0 outline-none">
          {savedPrograms.length === 0 ? (
            <div className="py-32 text-center border border-dashed border-zinc-100">
              <p className="font-cormorant italic text-zinc-400 text-2xl mb-4">Tu santuario está vacío</p>
              <Link href="/explorar" className="text-[10px] font-bold uppercase tracking-widest text-zinc-900 underline underline-offset-8">
                Descubrir programas
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {savedPrograms.map((item: any) => {
                const program = item.programs;
                if (!program) return null; // Evita que la página se rompa si un programa fue borrado

                return (
                  <Link key={item.id} href={`/programas/${program.slug}`} className="group block">
                    <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 mb-5 shadow-sm transition-all duration-700 group-hover:shadow-2xl">
                      <img 
                        src={program.thumbnail_url} 
                        alt={program.title}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/95 backdrop-blur-sm text-[8px] font-bold uppercase tracking-widest px-2 py-1 text-zinc-900 shadow-sm">
                          {program.experience_type || 'Programa'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-cormorant italic text-3xl text-zinc-900 leading-[0.9] group-hover:text-zinc-600 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                        Con {program.instructors?.name}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historial">
          <div className="py-20 text-center text-zinc-300 font-cormorant italic text-xl">
            Pronto podrás ver tu progreso aquí.
          </div>
        </TabsContent>
      </main>
    </div>
  )
}
