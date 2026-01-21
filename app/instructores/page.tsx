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
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((i) => (
            <Link
              key={i.id}
              href={`/instructor/${i.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
            >
              <div className="h-14 w-14 rounded-full border border-black/10 bg-black/5 flex items-center justify-center overflow-hidden">
                <span className="text-xs font-medium text-black/70">
                  {i.name
                    ?.split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>

              <div className="min-w-0">
                <div className="truncate text-base font-medium text-black">
                  {i.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
