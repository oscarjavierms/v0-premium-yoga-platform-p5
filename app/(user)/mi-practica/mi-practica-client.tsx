"use client"
import { useState } from "react"
import Link from "next/link"
import { Bookmark, Clock, Play } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export function MiPracticaClient({ savedClasses, savedPrograms, history }: any) {
  const [activeTab, setActiveTab] = useState("guardados")

  return (
    <div className="min-h-screen bg-white px-4 md:px-10">
      {/* Header Compacto y Elegante */}
      <header className="py-12 border-b border-zinc-100 flex flex-col md:flex-row justify-between items-baseline gap-4">
        <div>
          <h1 className="font-cormorant italic text-5xl text-zinc-900 tracking-tighter">Mi Santuario</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 mt-2">Tu espacio personal de práctica</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="bg-zinc-50 p-1 rounded-none border border-zinc-100">
            <TabsTrigger value="guardados" className="rounded-none text-[9px] uppercase tracking-widest px-6 data-[state=active]:bg-white">
              Guardados ({savedClasses.length + savedPrograms.length})
            </TabsTrigger>
            <TabsTrigger value="historial" className="rounded-none text-[9px] uppercase tracking-widest px-6 data-[state=active]:bg-white">
              Historial ({history.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <main className="py-10">
        <TabsContent value="guardados" className="mt-0 outline-none">
          {savedPrograms.length === 0 && savedClasses.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-zinc-50">
              <p className="font-cormorant italic text-zinc-400 text-xl">Aún no has guardado nada en tu santuario.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {savedPrograms.map((item: any) => (
                <Link key={item.id} href={`/programas/${item.programs.slug}`} className="group">
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 mb-4 shadow-sm group-hover:shadow-xl transition-all duration-700">
                    <img src={item.programs.thumbnail_url} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" alt="" />
                    <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 text-[8px] font-bold uppercase tracking-tighter text-zinc-900">Programa</div>
                  </div>
                  <h3 className="font-cormorant italic text-2xl text-zinc-900 leading-tight">{item.programs.title}</h3>
                  <p className="text-[9px] uppercase tracking-widest text-zinc-400 mt-1 font-bold">Por {item.programs.instructors?.name}</p>
                </Link>
              ))}
              
              {/* Aquí mapearías las clases individuales de forma similar */}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historial">
           {/* Diseño similar de grid pero para historial */}
        </TabsContent>
      </main>
    </div>
  )
}
