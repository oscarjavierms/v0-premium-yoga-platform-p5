import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructorPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  // 1) Buscar instructor por slug
  const { data: instructor, error: instructorError } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, specialty")
    .eq("slug", params.slug)
    .maybeSingle()

  // ✅ DEBUG TEMPORAL (para ver el error real)
  if (instructorError || !instructor) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <h1 className="font-serif text-3xl text-black">Debug Instructor</h1>

        <pre className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-xs text-black/80 overflow-auto">
          {JSON.stringify(
            {
              slug: params.slug,
              envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
              instructorError,
              instructor,
            },
            null,
            2
          )}
        </pre>

        <div className="mt-6 text-sm text-black/60">
          <p>
            Si <b>envUrl</b> no coincide con tu proyecto real de Supabase, tu
            Vercel está apuntando a otra base de datos.
          </p>
        </div>
      </div>
    )
  }

  // 2) Traer clases publicadas del instructor
  const { data: classes } = await supabase
    .from("classes")
    .select("id, title, slug, is_free, is_published, program_id, program_order")
    .eq("instructor_id", instructor.id)
    .eq("is_published", true)
    .order("program_order", { ascending: true })

  const safeClasses = classes ?? []

  // 3) Traer programas (desde los program_id en clases)
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
      <div className="text-xs text-black/50">
        <Link href="/instructores" className="hover:underline">
          Instructores
        </Link>
        <span className="px-2">/</span>
        <span className="text-black/70">{instructor.name}</span>
      </div>

      {/* Header */}
      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-black md:text-5xl">
            {instructor.name}
          </h1>

          {instructor.specialty ? (
            <p className="mt-3 text-sm text-black/60">{instructor.specialty}</p>
          ) : (
            <p className="mt-3 text-sm text-black/60">Instructor</p>
          )}
        </div>

        <div className="h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-black/5 md:h-32 md:w-32">
          {instructor.avatar_url ? (
            <img
              src={instructor.avatar_url}
              alt={instructor.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-sm font-medium text-black/70">
                {instructor.name
                  ?.split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Bio */}
      <section className="mt-10 rounded-2xl border border-black/10 bg-white p-8">
        <h2 className="text-sm font-medium text-black">Biografía</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          {instructor.bio ?? "Este instructor aún no tiene biografía publicada."}
        </p>
      </section>

      {/* Clases */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight text-black md:text-3xl">
          Clases
        </h2>

        {safeClasses.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-10">
            <p className="text-sm text-black/60">
              Aún no hay clases publicadas para este instructor.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4">
            {safeClasses.map((c) => (
              <Link
                key={c.id}
                href={`/clase/${c.slug}`}
                className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
              >
                <div className="flex items-center justify-between gap-8">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-black">
                      {c.title ?? "Clase"}
                    </p>
                    <p className="mt-1 text-xs text-black/50">
                      {c.is_free ? "Clase gratuita" : "Clase premium"}
                    </p>
                  </div>

                  <span className="text-xs text-black/60 group-hover:text-black">
                    Ver →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Programas */}
      <section className="mt-14">
        <h2 className="font-serif text-2xl tracking-tight text-black md:text-3xl">
          Programas
        </h2>

        {!programs || programs.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-10">
            <p className="text-sm text-black/60">
              Aún no hay programas asociados a este instructor.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {programs.map((p) => (
              <Link
                key={p.id}
                href={`/programa/${p.slug}`}
                className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
              >
                <p className="text-sm font-medium text-black">{p.title}</p>
                <p className="mt-2 text-xs text-black/60 group-hover:text-black">
                  Ver programa →
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
