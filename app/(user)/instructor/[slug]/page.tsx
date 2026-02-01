export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerClient()
  const { slug: rawSlug } = await params
  const cleanSlug = decodeURIComponent(rawSlug).trim()

  // 1. Buscamos al Instructor (Añadimos avatar_url)
  const { data: instructor, error: instError } = await supabase
    .from("instructors")
    .select("id, name, bio, specialty, avatar_url")
    .ilike("slug", cleanSlug)
    .maybeSingle()

  if (instError || !instructor) {
    return <main className="p-16 text-center font-bold uppercase tracking-widest">Instructor no encontrado</main>
  }

  // 2. Buscamos sus Programas (Cambiado a 'programs' según me indicaste)
  const { data: programs } = await supabase
    .from("programs") 
    .select("id, title, thumbnail_url, duration")
    .eq("instructor_id", instructor.id)
    .order("created_at", { ascending: false })

  return (
    <main className="bg-white min-h-screen">
      
      {/* --- SECCIÓN HERO (ESTILO ALO MOVES) --- */}
      <section className="relative h-[70vh] w-full bg-zinc-900">
        {/* Imagen de fondo (puedes usar el thumbnail del primer programa o una foto fija) */}
        <div className="absolute inset-0">
          <img 
            src={programs?.[0]?.thumbnail_url || "/placeholder-yoga.jpg"} 
            alt={instructor.name}
            className="w-full h-full object-cover opacity-60 grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
        </div>

        {/* Nombre Gigante Centrado */}
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-white text-6xl md:text-[120px] font-black uppercase tracking-tighter leading-none text-center px-4 drop-shadow-2xl">
            {instructor.name}
          </h1>
        </div>
      </section>

      {/* --- SECCIÓN PERFIL & BIO --- */}
      <section className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 items-start -mt-32">
          
          {/* Foto Circular Superpuesta */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-[8px] border-white shadow-2xl overflow-hidden bg-zinc-100">
              <img 
                src={instructor.avatar_url || "/placeholder-avatar.jpg"} 
                alt={instructor.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bio Text */}
          <div className="flex-1 md:pt-36">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4">Sobre el Instructor</h2>
            <p className="text-xl md:text-2xl text-zinc-800 font-light leading-relaxed max-w-3xl italic">
              "{instructor.bio}"
            </p>
            {/* Especialidades (Chips) */}
            <div className="flex flex-wrap gap-2 mt-6">
              {instructor.specialty?.map((s: string) => (
                <span key={s} className="px-3 py-1 bg-zinc-100 text-[10px] font-bold uppercase tracking-widest text-zinc-500 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- BIBLIOTECA DE PROGRAMAS --- */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12 border-b border-zinc-100 pb-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-black">
            Programas Disponibles ({programs?.length || 0})
          </h3>
        </div>

        {/* Grilla de 5 Columnas solicitada */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-12">
          {programs && programs.length > 0 ? (
            programs.map((item) => (
              <Link key={item.id} href={`/programas/${item.id}`} className="group cursor-pointer">
                {/* Thumbnail 16:9 con Hover Effect */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 rounded-lg shadow-sm">
                  {item.thumbnail_url ? (
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-200 text-[10px] uppercase tracking-widest">
                      Preview
                    </div>
                  )}
                  {/* Overlay Gradiente al hacer hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Badge de Duración */}
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-[9px] font-bold text-black uppercase tracking-tighter">
                    {item.duration} MIN
                  </div>
                </div>

                {/* Título Estilizado */}
                <div className="mt-4">
                  <h4 className="text-[13px] font-bold uppercase tracking-wide leading-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-1 uppercase font-medium">Yoga & Mindfulness</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
              <p className="text-xs uppercase tracking-widest text-zinc-400">
                Próximamente verás sus programas aquí.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
