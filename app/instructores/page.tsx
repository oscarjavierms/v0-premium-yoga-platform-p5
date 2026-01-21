import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructoresPage() {
  const supabase = await createServerClient()

  const { data: instructors, error } = await supabase
    .from("instructors")
.select("id, name, slug, bio, specialty")
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
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {instructors.map((i) => (
            <Link
              key={i.id}
              href={`/instructor/${i.slug}`}
              className="group rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/20"
            >
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full border border-black/10 bg-black/5" />
                <div className="min-w-0">
                  <div className="truncate text-base font-medium text-black">
                    {i.name}
                  </div>
                  <div className="truncate text-xs text-neutral-600">
                    {i.focus ?? "Instructor"}
                  </div>
                </div>
              </div>

              <p className="mt-4 line-clamp-3 text-sm text-neutral-700">
                {i.bio ?? "Perfil en construcción."}
              </p>

              <div className="mt-6 text-xs text-black/70">Ver perfil →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

