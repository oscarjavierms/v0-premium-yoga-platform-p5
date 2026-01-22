export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

// Agregamos Promise para que Next.js resuelva los parámetros correctamente
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createServerClient()
  
  // RESOLVEMOS la promesa de params antes de usar el slug
  const resolvedParams = await params
  const rawSlug = resolvedParams.slug
  
  // Limpieza del slug para evitar errores de búsqueda
  const cleanSlug = decodeURIComponent(rawSlug).trim()

  // Buscamos en Supabase (usamos .ilike para ser flexibles con Mayúsculas/Minúsculas)
  const { data: instructor, error } = await supabase
    .from("instructors")
    .select("id, slug, name, bio, specialty")
    .ilike("slug", cleanSlug) 
    .maybeSingle()

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-2xl font-light text-black">Error de servidor</h1>
        <p className="mt-2 text-sm text-black/60">{error.message}</p>
      </main>
    )
  }

  // Si no existe, ahora sí mostrará el slug real en lugar de "undefined"
  if (!instructor) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h1 className="text-3xl font-light text-black">Instructor no encontrado</h1>
        <p className="mt-4 text-black/60">
          No encontramos el perfil asociado a: <span className="font-medium text-black italic">"{cleanSlug}"</span>
        </p>
        <Link href="/instructores" className="mt-8 inline-block rounded-full border border-black px-6 py-2 text-sm hover:bg-black hover:text-white transition">
          Ver todos los instructores
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      {/* Diseño B&W Premium */}
      <header className="flex flex-col gap-4">
        <h1 className="text-5xl font-light tracking-tight text-black">{instructor.name}</h1>
        <p className="max-w-xl text-lg text-black/70 font-light leading-relaxed">
          {instructor.bio || "Inspirando presencia y movimiento."}
        </p>
        
        <div className="flex gap-2 mt-4">
          {instructor.specialty?.map((s: string) => (
            <span key={s} className="text-[10px] uppercase tracking-widest border border-black/10 px-3 py-1 rounded-full text-black/50">
              {s}
            </span>
          ))}
        </div>
      </header>

      <section className="mt-20 border-t border-black/5 pt-12">
        <h3 className="text-sm uppercase tracking-widest text-black/40">Contenido disponible</h3>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 italic text-sm">
          Cargando biblioteca de clases...
        </div>
      </section>
    </main>
  )
}
