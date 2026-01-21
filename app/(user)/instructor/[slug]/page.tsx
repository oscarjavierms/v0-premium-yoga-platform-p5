export const dynamic = "force-dynamic"
export const revalidate = 0

import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = await createServerClient()

  const slug = params.slug

  const { data: instructor, error } = await supabase
    .from("instructors")
    .select("id, slug, name, bio, specialty")
    .eq("slug", slug)
    .maybeSingle()

  // Si hay error real
  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-light tracking-wide text-black">
          Error cargando instructor
        </h1>
        <p className="mt-4 text-sm text-black/70">
          {error.message}
        </p>
        <Link
          href="/instructores"
          className="mt-8 inline-flex rounded-full border border-black px-5 py-2 text-sm text-black hover:bg-black hover:text-white transition"
        >
          Volver a instructores
        </Link>
      </main>
    )
  }

  // Si no existe instructor
  if (!instructor) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-light tracking-wide text-black">
          Instructor no encontrado
        </h1>
        <p className="mt-4 text-sm text-black/70">
          No existe un instructor con el slug: <span className="font-medium">{slug}</span>
        </p>

        <Link
          href="/instructores"
          className="mt-8 inline-flex rounded-full border border-black px-5 py-2 text-sm text-black hover:bg-black hover:text-white transition"
        >
          Volver a instructores
        </Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="flex flex-col gap-6">
        <h1 className="text-5xl font-light tracking-wide text-black">
          {instructor.name}
        </h1>

        {instructor.bio ? (
          <p className="max-w-2xl text-base leading-relaxed text-black/70">
            {instructor.bio}
          </p>
        ) : (
          <p className="max-w-2xl text-base leading-relaxed text-black/40">
            Este instructor aún no tiene biografía.
          </p>
        )}

        {/* Especialidades */}
        {Array.isArray(instructor.specialty) && instructor.specialty.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {instructor.specialty.map((tag: string) => (
              <span
                key={tag}
                className="rounded-full border border-black/20 bg-white px-4 py-1 text-xs uppercase tracking-wide text-black/70"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs uppercase tracking-wide text-black/40">
            Sin especialidades registradas
          </p>
        )}

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/clases"
            className="inline-flex rounded-full bg-black px-6 py-3 text-sm text-white hover:bg-black/90 transition"
          >
            Ver clases
          </Link>

          <button className="inline-flex rounded-full border border-black px-6 py-3 text-sm text-black hover:bg-black hover:text-white transition">
            Seguir instructor
          </button>
        </div>
      </header>

      <section className="mt-16 rounded-3xl border border-black/10 bg-white p-10">
        <h2 className="text-lg font-light tracking-wide text-black">
          Próximamente
        </h2>
        <p className="mt-2 text-sm text-black/60">
          Aquí van las clases, programas y contenido del instructor.
        </p>
      </section>
    </main>
  )
}
