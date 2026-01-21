export const dynamic = "force-dynamic"
export const revalidate = 0

import Image from "next/image"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructorPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  // ===============================
  // 1) INSTRUCTOR POR SLUG
  // ===============================
  const { data: instructor, error: instructorError } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, specialty")
    .eq("slug", params.slug)
    .maybeSingle()

  if (instructorError) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-light text-black">Error cargando instructor</h1>
        <p className="mt-2 text-sm text-black/60">
          Slug recibido: <b>{params.slug}</b>
        </p>

        <pre className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-xs text-black/80 overflow-auto">
          {JSON.stringify(instructorError, null, 2)}
        </pre>
      </main>
    )
  }

  // 🚫 NO usamos notFound() para evitar el bucle de 404
  if (!instructor) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-light text-black">Instructor no encontrado</h1>
        <p className="mt-2 text-sm text-black/60">
          No existe un instructor con slug: <b>{params.slug}</b>
        </p>

        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/70">
            ✅ La ruta sí funciona, pero Supabase no encontró este instructor.
          </p>
          <p className="mt-2 text-sm text-black/50">
            Revisa en Supabase si el slug existe exactamente igual.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/instructores"
            className="inline-flex items-center rounded-full border border-black/15 bg-white px-4 py-2 text-sm text-black hover:border-black/30"
          >
            ← Volver a instructores
          </Link>
        </div>
      </main>
    )
  }

  // ===============================
  // 2) CLASES DEL INSTRUCTOR
  // ===============================
  // ✅ NO ordenamos por created_at para evitar error si la columna no existe
  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("id, title, slug, is_published, instructor_id")
    .eq("instructor_id", instructor.id)
    .eq("is_published", true)

  // ===============================
  // 3) PROGRAMAS DEL INSTRUCTOR
  // ===============================
  // ⚠️ Esta tabla puede NO existir en tu proyecto todavía
  const { data: instructorPrograms, error: programsError } = await supabase
    .from("instructor_programs")
    .select("program_order, programs ( id, title, slug )")
    .eq("instructor_id", instructor.id)
    .order("program_order", { ascending: true })

  const programs =
    instructorPrograms
      ?.map((row: any) => row.programs)
      .filter(Boolean) ?? []

  return (
    <main className="mx-auto max-w-5xl px-6 py-14">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-black/10 bg-white">
          {instructor.avatar_url ? (
            <Image
              src={instructor.avatar_url}
              alt={instructor.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-black/70">
              {instructor.name
                ?.split(" ")
                .map((p: string) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-4xl font-light tracking-tight text-black">
            {instructor.name}
          </h1>

          {Array.isArray(instructor.specialty) && instructor.specialty.length > 0 ? (
            <p className="mt-2 text-sm text-black/60">
              {instructor.specialty.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>

      {/* Bio */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8">
        <h2 className="text-lg font-medium text-black">Biografía</h2>
        <p className="mt-3 whitespace-pre-line text-black/75">
          {instructor.bio || "Este instructor aún no tiene biografía."}
        </p>
      </section>

      {/* Debug opcional (para terminar el problema sin bucle) */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8">
        <h2 className="text-lg font-medium text-black">Debug (temporal)</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-medium text-black">Slug</div>
            <div className="mt-1 text-sm text-black/70">{params.slug}</div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-medium text-black">Instructor ID</div>
            <div className="mt-1 text-sm text-black/70">{instructor.id}</div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-medium text-black">Error Clases</div>
            <pre className="mt-2 text-xs text-black/70 overflow-auto">
              {classesError ? JSON.stringify(classesError, null, 2) : "null"}
            </pre>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5">
            <div className="text-sm font-medium text-black">Error Programas</div>
            <pre className="mt-2 text-xs text-black/70 overflow-auto">
              {programsError ? JSON.stringify(programsError, null, 2) : "null"}
            </pre>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-medium text-black">Programas</h2>
          <Link
            href="/programas"
            className="text-sm text-black/70 underline underline-offset-4 hover:text-black"
          >
            Ver todos
          </Link>
        </div>

        {programsError ? (
          <p className="mt-4 text-sm text-black/60">
            Aún no tienes tabla <b>instructor_programs</b> configurada (o hubo error).
          </p>
        ) : programs.length === 0 ? (
          <p className="mt-4 text-sm text-black/60">
            No hay programas asignados a este instructor todavía.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {programs.map((p: any) => (
              <Link
                key={p.id}
                href={`/programa/${p.slug}`}
                className="rounded-2xl border border-black/10 bg-white p-5 transition hover:border-black/20"
              >
                <div className="text-base font-medium text-black">{p.title}</div>
                <div className="mt-1 text-xs text-black/60">Ver programa →</div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Classes */}
      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-medium text-black">Clases</h2>
          <Link
            href="/explorar"
            className="text-sm text-black/70 underline underline-offset-4 hover:text-black"
          >
            Explorar
          </Link>
        </div>

        {classesError ? (
          <p className="mt-4 text-sm text-black/60">
            Error cargando clases del instructor.
          </p>
        ) : classes?.length ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {classes.map((c: any) => (
              <Link
                key={c.id}
                href={`/clase/${c.slug}`}
                className="rounded-2xl border border-black/10 bg-white p-5 transition hover:border-black/20"
              >
                <div className="text-base font-medium text-black">{c.title}</div>
                <div className="mt-1 text-xs text-black/60">Ver clase →</div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-black/60">
            Este instructor aún no tiene clases publicadas.
          </p>
        )}
      </section>
    </main>
  )
}
