export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient()
  const { slug: rawSlug } = await params
  const cleanSlug = decodeURIComponent(rawSlug).trim()

  // 1. Buscamos al Instructor (Incluir cover_url)
  const { data: instructor, error: instError } = await supabase
    .from("instructors")
    .select("id, name, bio, specialty, avatar_url, cover_url")
    .ilike("slug", cleanSlug)
    .maybeSingle()

  if (instError || !instructor) {
    return <main className="p-16 text-center font-bold uppercase tracking-widest">Instructor no encontrado</main>
  }

  // 2. Buscamos sus Programas
  const { data: programs } = await supabase
    .from("programs")
    .select("id, title, thumbnail_url, duration_weeks, slug")
    .eq("instructor_id", instructor.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  return (
    <main className="bg-white min-h-screen">
      
      {/* --- SECCIÓN HERO CON COVER PHOTO --- */}
      <section className="relative h-[50vh] w-full bg-zinc-900 overflow-hidden">
        {/* Cover Photo de fondo */}
        {instructor.cover_url ? (
          <Image
            src={instructor.cover_url}
            alt={instructor.name}
            fill
            className="w-full h-full object-cover opacity-70"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-800 to-zinc-900" />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-white" />

        {/* Nombre Centrado */}
        <div className="relative h-full flex items-center justify-center">
          <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-center px-4 drop-shadow-2xl">
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
              {instructor.avatar_url ? (
                <Image
                  src={instructor.avatar_url}
                  alt={instructor.name}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-300 flex items-center justify-center">
                  <span className="text-zinc-400">Sin foto</span>
                </div>
              )}
            </div>
          </div>

          {/* Bio Text */}
          <div className="flex-1 md:pt-20">
            <h2 className="text-xs font-bold uppercase tracking-[0.4em] text-zinc-400 mb-4">Sobre el Instructor</h2>
            <p className="text-lg md:text-2xl text-zinc-800 font-light leading-relaxed max-w-3xl italic">
              "{instructor.bio || 'Instructor certificado en yoga y meditación.'}"
            </p>
            
            {/* Especialidades (Chips) */}
            {instructor.specialty && instructor.specialty.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {instructor.specialty.map((s: string) => (
                  <span 
                    key={s} 
                    className="px-3 py-1 bg-zinc-100 text-[10px] font-bold uppercase tracking-widest text-zinc-700 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- BIBLIOTECA DE PROGRAMAS --- */}
      <section className="max-w-[1400px] mx-auto px-6 py-24">
        <div className="flex items-center justify-between mb-12 border-b border-zinc-200 pb-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-black">
            Programas Disponibles ({programs?.length || 0})
          </h3>
        </div>

        {/* Grilla de Programas */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {programs && programs.length > 0 ? (
            programs.map((program) => (
              <Link 
                key={program.id} 
                href={`/programas/${program.slug || program.id}`}
                className="group cursor-pointer"
              >
                {/* Thumbnail con Hover Effect */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100 rounded-lg shadow-sm">
                  {program.thumbnail_url ? (
                    <Image
                      src={program.thumbnail_url}
                      alt={program.title}
                      fill
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300 text-[10px] uppercase tracking-widest text-zinc-600">
                      Sin imagen
                    </div>
                  )}
                  
                  {/* Overlay al hacer hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Badge de Duración */}
                  {program.duration_weeks && (
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 text-[9px] font-bold text-black uppercase tracking-tighter">
                      {program.duration_weeks} SEMANAS
                    </div>
                  )}
                </div>

                {/* Título */}
                <div className="mt-4">
                  <h4 className="text-[13px] font-bold uppercase tracking-wide leading-tight text-zinc-900 group-hover:text-zinc-600 transition-colors line-clamp-2">
                    {program.title}
                  </h4>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 rounded-3xl">
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
