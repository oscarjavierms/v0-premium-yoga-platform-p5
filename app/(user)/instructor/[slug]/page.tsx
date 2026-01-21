import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructorPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  // 1) Instructor por slug
  const { data: instructor, error: instructorError } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, specialty")
    .eq("slug", params.slug)
    .maybeSingle()

  if (instructorError) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-light text-black">Error</h1>
        <pre className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-xs text-black/80">
          {JSON.stringify(instructorError, null, 2)}
        </pre>
      </main>
    )
  }

  if (!instructor) notFound()

  // 2) Clases del instructor (si tu tabla classes tiene instructor_id)
  const { data: classes } = await supabase
    .from("classes")
    .select("id, title, slug, is_published")
    .eq("instructor_id", instructor.id)
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  // 3) Programas del instructor (si tienes tabla intermedia)
  // Si NO tienes tabla intermedia todavía, esto te dará vacío y no pasa nada.
  const { data: instructorPrograms } = await supabase
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

        {programs.length === 0 ? (
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
                <div className="mt-1 text-xs text-black/60">
                  Ver programa →
                </div>
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

        {classes?.length ? (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {classes.map((c: any) => (
              <Link
                key={c.id}
                href={`/clase/${c.slug}`}
                className="rounded-2xl border border-black/10 bg-white p-5 transition hover:border-black/20"
              >
                <div className="text-base font-medium text-black">
                  {c.title}
                </div>
                <div className="mt-1 text-xs text-black/60">
                  Ver clase →
                </div>
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
