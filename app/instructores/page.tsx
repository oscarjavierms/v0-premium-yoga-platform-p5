import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructoresPage() {
  const supabase = await createServerClient()

  const { data: instructors, error } = await supabase
    .from("instructors")
    .select("id, name, slug, avatar_url")
    .order("name", { ascending: true })

  if (error) {
    return (
      <div className="mx-auto w-full max-w-6xl px-6 py-12">
        <h1 className="font-serif text-4xl tracking-tight">Instructores</h1>
        <p className="mt-4 text-sm text-neutral-600">
          Error cargando instructores.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <h1 className="font-serif text-4xl tracking-tight">Instructores</h1>
      <p className="mt-3 text-sm text-neutral-600">
        Guías que sostienen tu práctica con presencia.
      </p>

      {!instructors || instructors.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-black/10 bg-white p-10">
          <p className="text-sm text-neutral-600">
            Aún no hay instructores disponibles.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-y-10 md:grid-cols-4 lg:grid-cols-6">
          {instructors.map((i) => (
            <Link
              key={i.id}
              href={`/instructor/${i.slug}`}
              className="group flex flex-col items-center gap-4"
            >
              <div className="h-28 w-28 overflow-hidden rounded-full border border-black/10 bg-black/5 transition group-hover:border-black/20 md:h-32 md:w-32">
                {i.avatar_url ? (
                  <img
                    src={i.avatar_url}
                    alt={i.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-sm font-medium text-black/60">
                      {i.name
                        ?.split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold tracking-wide uppercase text-black">
                  {i.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
