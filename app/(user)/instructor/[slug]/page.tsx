import { createServerClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function InstructorPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  // 1) Traer instructor por slug
  const { data: instructor, error: instructorError } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, specialty")
    .eq("slug", params.slug)
    .maybeSingle()

  if (instructorError) {
    console.error("Instructor error:", instructorError)
  }

  if (!instructor) {
    notFound()
  }

  // 2) Traer clases del instructor
  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("id, title, slug, is_free, is_published")
    .eq("instructor_id", instructor.id)
    .eq("is_published", true)
    .order("title", { ascending: true })

  if (classesError) {
    console.error("Classes error:", classesError)
  }

  // 3) Traer programas del instructor (según tu tabla programs que tiene instructor_id)
  // Si en tu DB los programas NO tienen instructor_id directo, me dices y lo ajustamos
  const { data: programs, error: programsError } = await supabase
    .from("programs")
    .select("id, title, slug")
    .eq("instructor_id", instructor.id)
    .order("title", { ascending: true })

  if (programsError) {
    console.error("Programs error:", programsError)
  }

  const initials =
    instructor.name
      ?.split(" ")
      .map((p: string) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "IN"

  return (
    <main className="mx-auto w-full max-w-6xl px-6 py-12">
      {/* Header instructor */}
      <section className="flex flex-col gap-8 rounded-3xl border border-black/10 bg-white p-8">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar */}
          <div className="relative h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-black/5">
            {instructor.avatar_url ? (
              <Image
                src={instructor.avatar_url}
                alt={instructor.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="text-lg font-semibold text-black/70">
                  {initials}
                </span>
              </div>
            )}
          </div>

          {/* Name + tags */}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-4xl font-serif tracking-tight text-black">
              {instructor.name}
            </h1>

            {Array.isArray(instructor.specialty) &&
              instructor.specialty.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {instructor.specialty.slice(0, 6).map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs text-black/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
          </div>
        </div>

        {/* Bio */}
        {instructor.bio ? (
          <p className="max-w-3xl text-sm leading-relaxed text-black/70">
            {instructor.bio}
          </p>
        ) : (
          <p className="text-sm text-black/40">
            Este instructor todavía no tiene biografía.
          </p>
        )}
      </section>

      {/* Clases */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-serif text-black">Clases</h2>
          <span className="text-xs text-black/50">
            {classes?.length ?? 0} clases
          </span>
        </div>

        {classes && classes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {classes.map((c) => (
              <Link
                key={c.id}
                href={`/clase/${c.slug}`}
                className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-black">
                      {c.title}
                    </div>
                    <div className="mt-1 text-xs text-black/50">
                      {c.is_free ? "Gratis" : "Premium"}
                    </div>
                  </div>

                  <div className="text-sm text-black/40 transition group-hover:text-black">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/50">
            Este instructor todavía no tiene clases publicadas.
          </div>
        )}
      </section>

      {/* Programas */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-serif text-black">Programas</h2>
          <span className="text-xs text-black/50">
            {programs?.length ?? 0} programas
          </span>
        </div>

        {programs && programs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {programs.map((p) => (
              <Link
                key={p.id}
                href={`/programa/${p.slug}`}
                className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-base font-medium text-black">
                      {p.title}
                    </div>
                    <div className="mt-1 text-xs text-black/50">
                      Programa completo
                    </div>
                  </div>

                  <div className="text-sm text-black/40 transition group-hover:text-black">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-black/10 bg-white p-6 text-sm text-black/50">
            Este instructor todavía no tiene programas asignados.
          </div>
        )}
      </section>
    </main>
  )
}
