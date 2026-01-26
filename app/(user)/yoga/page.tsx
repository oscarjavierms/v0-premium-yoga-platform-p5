import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

// Esto asegura que cada vez que alguien entre, se busquen datos nuevos en la DB
export const revalidate = 0 

export default async function YogaPage() {
  const supabase = await createClient()

  // Buscamos específicamente los programas de "Yoga" que estén publicados
  const { data: programs, error } = await supabase
    .from("programs")
    .select("*, instructors(name)")
    .eq("experience_type", "Yoga")
    .eq("is_published", true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error cargando yoga:", error)
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Header Editorial de Lujo */}
        <header className="mb-24 border-b border-zinc-100 pb-16 text-center md:text-left">
          <div className="flex flex-col gap-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-zinc-400">
              Santuario Yoga Collection
            </span>
            <h1 className="text-7xl md:text-9xl font-cormorant italic text-zinc-900 leading-[0.8] tracking-tighter">
              Yoga
            </h1>
            <p className="text-zinc-500 font-light italic text-xl max-w-lg leading-relaxed mt-4">
              Prácticas curadas para la excelencia física y mental. Bienestar que sostiene vidas exigentes.
            </p>
          </div>
        </header>

        {/* Listado Dinámico de Programas */}
        {programs && programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
            {programs.map((program) => (
              <Link 
                href={`/programas/${program.slug}`} 
                key={program.id} 
                className="group flex flex-col gap-8 transition-all"
              >
                {/* Contenedor de "Tarjeta de Lujo" vertical */}
                <div className="aspect-[4/5] bg-zinc-50 border border-zinc-100 rounded-sm overflow-hidden relative flex items-center justify-center transition-all duration-700 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] group-hover:-translate-y-4">
                  
                   {/* Texto decorativo de fondo */}
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[8px] tracking-[0.8em] text-zinc-200 uppercase font-black rotate-90">
                        Private Practice
                      </span>
                   </div>

                   {/* Badge flotante de Área de Enfoque */}
                   <div className="absolute bottom-8 left-8">
                      <div className="bg-white/90 backdrop-blur-xl px-5 py-2 border border-zinc-100 shadow-sm">
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-900">
                          {program.focus_area || "General"}
                        </span>
                      </div>
                   </div>
                </div>

                {/* Información del Programa */}
                <div className="space-y-4 px-2">
                  <div className="flex justify-between items-center border-b border-zinc-50 pb-3">
                    <span className="text-[9px] uppercase tracking-[0.4em] text-zinc-400 font-bold">
                      {program.category || "Vinyasa"}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-300 font-medium italic">
                      {program.difficulty}
                    </span>
                  </div>
                  
                  <h3 className="text-4xl font-cormorant italic text-zinc-900 leading-[1.1] group-hover:text-zinc-500 transition-colors">
                    {program.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 pt-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-[1px] bg-zinc-900"></div>
                    <p className="text-[10px] text-zinc-900 font-bold tracking-widest uppercase">
                      By {program.instructors?.name || "Santuario Instructor"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Estado Vacío Estilizado */
          <div className="py-40 text-center border-t border-zinc-50">
            <p className="font-cormorant italic text-zinc-300 text-4xl">
              Nuevas sesiones en curación editorial...
            </p>
            <p className="text-xs uppercase tracking-widest text-zinc-400 mt-4">Próximamente</p>
          </div>
        )}
      </div>
    </main>
  )
}
