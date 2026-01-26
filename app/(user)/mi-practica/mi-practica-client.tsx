"use client"

import { useState } from "react"
import Link from "next/link"
import { Play, Bookmark, Clock, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ClassItem {
  id: string
  title: string
  slug: string
  thumbnail_url: string
  duration_minutes: number
  difficulty: string
  pillar: string
  instructors: { name: string } | null
}

interface MiPracticaClientProps {
  savedClasses: Array<ClassItem & { savedAt: string }>
  savedPrograms: Array<{
    id: string
    title: string
    slug: string
    thumbnail_url: string
    duration_weeks: number
    difficulty: string
    pillar: string
    instructors: { name: string } | null
    savedAt: string
  }>
  history: Array<ClassItem & { completedAt: string; watchedMinutes: number }>
}

export function MiPracticaClient({
  savedClasses,
  savedPrograms,
  history,
}: MiPracticaClientProps) {
  const [activeTab, setActiveTab] = useState("guardados")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header Estilo Minimalista */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-b border-zinc-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-cormorant italic text-5xl sm:text-6xl tracking-tight text-zinc-900">
            Mi Santuario
          </h1>
          <p className="mt-4 text-zinc-400 font-light italic text-lg">
            Tu biblioteca personal de introspección y movimiento.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24 mt-12">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-transparent border-b border-zinc-100 w-full justify-center rounded-none h-auto p-0 mb-12 space-x-12">
              <TabsTrigger 
                value="guardados" 
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900",
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "pb-4 px-2 text-[10px] uppercase font-bold tracking-[0.3em] transition-all"
                )}
              >
                Guardados ({savedClasses.length + savedPrograms.length})
              </TabsTrigger>
              <TabsTrigger 
                value="historial" 
                className={cn(
                  "rounded-none border-b-2 border-transparent data-[state=active]:border-zinc-900",
                  "data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                  "pb-4 px-2 text-[10px] uppercase font-bold tracking-[0.3em] transition-all"
                )}
              >
                Historial ({history.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guardados" className="mt-0 outline-none">
              {savedClasses.length === 0 && savedPrograms.length === 0 ? (
                <div className="text-center py-20">
                  <h3 className="font-cormorant italic text-2xl mb-2 text-zinc-400">Tu santuario está esperando ser llenado</h3>
                  <Link href="/explorar" className="text-[10px] uppercase font-bold tracking-widest underline underline-offset-8 text-zinc-900">
                    Explorar programas
                  </Link>
                </div>
              ) : (
                <div className="space-y-20">
                  {/* Saved Programs - EL DISEÑO QUE PEDISTE */}
                  {savedPrograms.length > 0 && (
                    <div>
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300 mb-8 text-center">
                        Programas Guardados
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {savedPrograms.map((program) => (
                          <Link key={program.id} href={`/programas/${program.slug}`} className="group">
                            <div className="relative aspect-[16/10] overflow-hidden mb-5 bg-zinc-50 shadow-sm transition-all duration-700 group-hover:shadow-xl">
                              <img
                                src={program.thumbnail_url}
                                alt={program.title}
                                className="w-full h-full object-cover transition-all duration-1000 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105"
                              />
                              <div className="absolute top-4 left-4">
                                <span className="bg-white/90 backdrop-blur-sm text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 text-zinc-900">
                                  {program.duration_weeks} semanas
                                </span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h4 className="font-cormorant italic text-3xl text-zinc-900 group-hover:text-zinc-600 transition-colors">
                                {program.title}
                              </h4>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400 font-bold">
                                Por {program.instructors?.name} • {program.pillar}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Saved Classes */}
                  {savedClasses.length > 0 && (
                    <div className="pt-10 border-t border-zinc-50">
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-300 mb-8 text-center">
                        Clases Individuales
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {savedClasses.map((classItem) => (
                          <Link key={classItem.id} href={`/clases/${classItem.slug}`} className="group">
                            <div className="relative aspect-square overflow-hidden mb-3 bg-zinc-50 transition-all group-hover:shadow-md">
                              <img
                                src={classItem.thumbnail_url}
                                alt={classItem.title}
                                className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700"
                              />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                  <Play className="h-4 w-4 text-zinc-900 fill-zinc-900 ml-0.5" />
                                </div>
                              </div>
                            </div>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-zinc-800 truncate">{classItem.title}</h4>
                            <p className="text-[10px] italic text-zinc-400 font-cormorant">{classItem.duration_minutes} min • {classItem.pillar}</p>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Historial (Estilo minimalista) */}
            <TabsContent value="historial" className="mt-0 outline-none">
              <div className="max-w-3xl mx-auto space-y-4">
                {history.map((item) => (
                  <Link key={item.id} href={`/clases/${item.slug}`} className="block group">
                    <div className="flex items-center gap-6 p-4 border border-transparent hover:border-zinc-100 hover:bg-zinc-50/50 transition-all">
                      <div className="relative w-24 aspect-video overflow-hidden shrink-0 bg-zinc-100">
                        <img src={item.thumbnail_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-300">
                            Completada el {formatDate(item.completedAt)}
                          </span>
                        </div>
                        <h4 className="font-cormorant italic text-xl text-zinc-800 leading-tight truncate">{item.title}</h4>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
