import { notFound } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructorProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  // 1) Instructor
  const { data: instructor, error: instructorError } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, specialty")
    .eq("slug", params.slug)
    .single()

  if (instructorError || !instructor) return notFound()

  // 2) Clases del instructor (publicadas)
  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("id, title, slug, is_free, is_published, program_id, program_order")
    .eq("instructor_id", instructor.id)
    .eq("is_published", true)
    .order("program_order", { ascending: true })

  const safeClasses = classesError ? [] : classes ?? []

  // 3) Programas únicos (a partir de program_id en classes)
  const programIds = Array.from(
    new Set(safeClasses.map((c) => c.program_id).filter(Boolean))
  ) as string[]

  const { data: programs } =
    programIds.length > 0
      ? await supabase
          .from("programs")
          .select("id, title, slug")
          .in("id", programIds)
      : { data: [] as any[] }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      {/* Breadcrumb */}
      <p className="text-xs text-neutral-500">
        <Link href="/instructores" className="hover:underline">
          Instructores
        </Link>{" "}
        <span className="px-2">/</span>
        <span className="text-neutral-700">{instructor.name}</span>
      </p>

      {/* Header */}
      <div className="mt-4 flex items-start justify-between gap-8">
        <div>
          <h1 className="font-serif text-4xl tracking-tight">
            {instructor.name}
          </h1>

          {instructor.specialty ? (
            <p className="mt-2 text-sm text-neutral-600">
              {instructor.specialty}
            </p>
          ) : null}
        </div>

        {/* Avatar */}
        <div className="h-20 w-20 rounded-full border border-black/10 bg-black/5 flex items-center justify-center overflow-hidden">
          <span className="text-sm font-medium text-black/70">
            {instructor.name
              ?.split(" ")
              .map((p) => p[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </span>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-10 rounded-2xl border border-black/10 bg-white p-8">
        <h2 className="text-sm font-medium text-black">Biografía</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          {instructor.bio ?? "Este instructor aún no tiene biografía publicada."}
        </p>
      </div>

      {/* Clases */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">
          Clases del instructor
        </h2>

        {safeClasses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-10">
            <p className="text-sm text-neutral-600">
              Aún no hay clases publicadas para este instructor.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {safeClasses.map((c) => (
              <Link
                key={c.id}
                href={`/clase/${c.slug}`}
                className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
              >
                <div className="flex items-center justify-between gap-6">
                  <div>
                    <p className="text-sm font-medium text-black">{c.title}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {c.is_free ? "Clase gratuita" : "Clase premium"}
                    </p>
                  </div>

                  <div className="text-xs text-black/70">Ver clase →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Programas */}
      <div className="mt-12">
        <h2 className="font-serif text-2xl tracking-tight">
          Programas del instructor
        </h2>

        {!programs || programs.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-10">
            <p className="text-sm text-neutral-600">
              Aún no hay programas asociados a este instructor.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {programs.map((p) => (
              <Link
                key={p.id}
                href={`/programa/${p.slug}`}
                className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
              >
                <p className="text-sm font-medium text-black">{p.title}</p>
                <p className="mt-2 text-xs text-black/70">Ver programa →</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
