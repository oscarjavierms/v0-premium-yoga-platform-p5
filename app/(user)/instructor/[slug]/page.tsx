import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function InstructorProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  const { data: instructor, error } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, specialty")
    .eq("slug", params.slug)
    .maybeSingle()

  if (error) {
    console.error("Error cargando instructor:", error)
  }

  if (!instructor) {
    return notFound()
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      {/* Header */}
      <div className="flex items-center gap-6">
        <div className="h-20 w-20 rounded-full border border-black overflow-hidden bg-white">
          {instructor.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={instructor.avatar_url}
              alt={instructor.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm font-medium text-black">
              {instructor.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h1 className="font-serif text-4xl tracking-tight text-black">
            {instructor.name}
          </h1>
          <p className="mt-1 text-sm text-black/60">Instructor</p>
        </div>
      </div>

      {/* Bio */}
      {instructor.bio ? (
        <div className="mt-10">
          <h2 className="text-sm font-medium tracking-wide text-black">
            Biografía
          </h2>
          <p className="mt-3 text-base leading-relaxed text-black/80">
            {instructor.bio}
          </p>
        </div>
      ) : null}

      {/* Placeholder: clases del instructor */}
      <div className="mt-14">
        <h2 className="text-sm font-medium tracking-wide text-black">
          Clases
        </h2>

        <div className="mt-4 rounded-2xl border border-black/10 bg-white p-8">
          <p className="text-sm text-black/60">
            Próximamente: clases asociadas a este instructor.
          </p>
        </div>
      </div>
    </main>
  )
}
