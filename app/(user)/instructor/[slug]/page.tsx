export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerClient()
  const { slug: rawSlug } = await params
  const cleanSlug = decodeURIComponent(rawSlug).trim()

  // 1. Buscamos al Instructor
  const { data: instructor, error: instError } = await supabase
    .from("instructors")
    .select("id, name, bio, specialty")
    .ilike("slug", cleanSlug)
    .maybeSingle()

  if (instError || !instructor) {
    return <main className="p-16 text-center">Instructor no encontrado</main>
  }

  // 2. Buscamos sus Clases/Programas (Asumiendo que la tabla se llama 'classes')
  // Cambia 'classes' por el nombre real de tu tabla si es distinto
  const { data: classes } = await supabase
    .from("classes") 
    .select("id, title, thumbnail_url, duration")
    .eq("instructor_id", instructor.id)
    .order("created_at", { ascending: false })

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-16 bg-white min-h-screen">
      {/* Header del Instructor - Estilo Minimalista Lujo */}
      <header className="mb-20">
        <h1 className="text-6xl font-light tracking-tighter text-black mb-6">
          {instructor.name}
        </h1>
        <p className="max-w-2xl text-lg text-black/60 font-light leading-relaxed">
          {instructor.bio}
        </p>
      </header>

      {/* Título de la Sección */}
      <div className="flex items-center justify-between mb-8 border-b border-black/5 pb-4">
        <h2 className="text-xs uppercase tracking-[0.3em] text-black/40 font-medium">
          Biblioteca de Clases ({classes?.length || 0})
        </h2>
      </div>

      {/* GRILLA DE 5 COLUMNAS - Tu diseño solicitado */}
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
                <div className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 text-[10px] text-white">
                  {item.duration} min
                </div>
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
    </main>
  )
}
