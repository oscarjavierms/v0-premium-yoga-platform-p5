export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import Image from "next/image"
import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerClient()
  const { slug: rawSlug } = await params
  const cleanSlug = decodeURIComponent(rawSlug).trim()

  // 1. Buscamos al Instructor con avatar y cover
  const { data: instructor, error: instError } = await supabase
    .from("instructors")
    .select("id, name, bio, specialty, avatar_url, cover_url, instagram_url")
    .ilike("slug", cleanSlug)
    .maybeSingle()

  if (instError || !instructor) {
    return <main className="p-16 text-center">Instructor no encontrado</main>
  }

  // 2. Buscamos sus Clases/Programas
  const { data: classes } = await supabase
    .from("classes") 
    .select("id, title, thumbnail_url, duration")
    .eq("instructor_id", instructor.id)
    .order("created_at", { ascending: false })

  return (
    <main className="bg-white min-h-screen">
      {/* COVER IMAGE - Banner de portada */}
      {instructor.cover_url ? (
        <div className="relative w-full aspect-[21/9] bg-gradient-to-b from-black/5 to-black/20">
          <Image
            src={instructor.cover_url}
            alt={`${instructor.name} - Portada`}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          {/* Overlay gradient para mejor legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Nombre del instructor sobre la portada */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="mx-auto max-w-[1400px] flex items-end gap-6">
              {/* Avatar circular sobre la portada */}
              {instructor.avatar_url && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl flex-shrink-0">
                  <Image
                    src={instructor.avatar_url}
                    alt={instructor.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              
              <div className="pb-2">
                <h1 className="text-5xl md:text-6xl font-light tracking-tighter text-white mb-2 drop-shadow-lg">
                  {instructor.name}
                </h1>
                {instructor.specialty && Array.isArray(instructor.specialty) && instructor.specialty.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {instructor.specialty.map((spec, i) => (
                      <span key={i} className="text-xs text-white/90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Sin portada - Header simple */
        <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-8">
          <div className="flex items-center gap-6 mb-6">
            {instructor.avatar_url && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-black/10 flex-shrink-0">
                <Image
                  src={instructor.avatar_url}
                  alt={instructor.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div>
              <h1 className="text-5xl md:text-6xl font-light tracking-tighter text-black">
                {instructor.name}
              </h1>
              {instructor.specialty && Array.isArray(instructor.specialty) && instructor.specialty.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {instructor.specialty.map((spec, i) => (
                    <span key={i} className="text-xs text-black/60 bg-black/5 px-3 py-1 rounded-full">
                      {spec}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Biografía */}
        {instructor.bio && (
          <div className="mb-16">
            <h2 className="text-xs uppercase tracking-[0.3em] text-black/40 font-medium mb-4">
              Sobre el Instructor
            </h2>
            <p className="max-w-3xl text-lg text-black/70 font-light leading-relaxed">
              {instructor.bio}
            </p>
            {instructor.instagram_url && (
              <a 
                href={instructor.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-black/60 hover:text-black transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
            )}
          </div>
        )}

        {/* Título de la Sección de Clases */}
        <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
          <h2 className="text-xs uppercase tracking-[0.3em] text-black/40 font-medium">
            Programas Disponibles ({classes?.length || 0})
          </h2>
        </div>

        {/* GRILLA DE CLASES */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-10">
          {classes && classes.length > 0 ? (
            classes.map((item) => (
              <Link key={item.id} href={`/clase/${item.id}`} className="group cursor-pointer">
                {/* Contenedor 16:9 */}
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-100 rounded-sm">
                  {item.thumbnail_url ? (
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-900 text-[10px] text-white/20 uppercase tracking-widest">
                      16:9 Preview
                    </div>
                  )}
                  {/* Duración flotante */}
                  {item.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-[10px] text-white">
                      {item.duration} min
                    </div>
                  )}
                </div>

                {/* Título del Video */}
                <h3 className="mt-3 text-sm font-light leading-snug text-black group-hover:underline decoration-black/20 underline-offset-4">
                  {item.title}
                </h3>
              </Link>
            ))
          ) : (
            <p className="col-span-full py-20 text-center text-sm text-black/30 italic">
              Aún no hay clases publicadas por este instructor.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
