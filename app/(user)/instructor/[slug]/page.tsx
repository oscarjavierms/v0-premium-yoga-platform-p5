export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = await createServerClient()

  // 1. Limpiamos el slug: quitamos espacios y decodificamos caracteres raros
  const rawSlug = params.slug
  const cleanSlug = decodeURIComponent(rawSlug).trim()

  // 2. Usamos .ilike para que 'oscar' encuentre a 'Oscar' u 'OSCAR'
  const { data: instructor, error } = await supabase
    .from("instructors")
    .select("id, slug, name, bio, specialty")
    .ilike("slug", cleanSlug) 
    .maybeSingle()

  // Manejo de Error de Conexión
  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-light tracking-wide text-black">Error de conexión</h1>
        <p className="mt-4 text-sm text-black/70">{error.message}</p>
      </main>
    )
  }

  // Si no existe el instructor
  if (!instructor) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h1 className="text-4xl font-light tracking-tight text-black">Instructor no encontrado</h1>
        <p className="mt-4 text-lg text-black/60">
          No encontramos a nadie con el usuario: <span className="font-semibold italic">"{cleanSlug}"</span>
        </p>
        <div className="mt-10">
          <Link href="/instructores" className="rounded-full border border-black px-8 py-3 text-sm hover:bg-black hover:text-white transition-all">
            Ver todos los instructores
          </Link>
        </div>
      </main>
    )
  }

  // Renderizado de la página (Tu diseño B&W original)
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 animate-in fade-in duration-700">
      <header className="flex flex-col gap-6">
        <span className="text-xs uppercase tracking-[0.2em] text-black/40">Perfil Profesional</span>
        <h1 className="text-6xl font-light tracking-tighter text-black">
          {instructor.name}
        </h1>

        {instructor.bio ? (
          <p className="max-w-2xl text-lg leading-relaxed text-black/70 font-light">
            {instructor.bio}
          </p>
        ) : (
          <p className="max-w-2xl text-base italic text-black/30">Sin biografía disponible.</p>
        )}

        {/* Especialidades */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Array.isArray(instructor.specialty) && instructor.specialty.length > 0 ? (
            instructor.specialty.map((tag: string) => (
              <span key={tag} className="rounded-full border border-black/10 bg-neutral-50 px-4 py-1.5 text-[10px] uppercase tracking-widest text-black/60">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-[10px] uppercase tracking-widest text-black/30">Generalista</span>
          )}
        </div>

        <div className="mt-8 flex gap-4">
          <Link href="/clases" className="bg-black text-white px-8 py-3 rounded-full text-sm hover:bg-neutral-800 transition">
            Ver clases
          </Link>
          <button className="border border-black px-8 py-3 rounded-full text-sm hover:bg-black hover:text-white transition">
            Seguir
          </button>
        </div>
      </header>

      <section className="mt-24 border-t border-black/5 pt-16">
        <h2 className="text-2xl font-light tracking-tight text-black mb-8">Contenido de {instructor.name.split(' ')[0]}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 italic">
             {/* Aquí irá tu grilla de 5 o 3 según el diseño final */}
             Próximamente...
        </div>
      </section>
    </main>
  )
}
