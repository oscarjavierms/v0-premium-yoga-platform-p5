import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructorPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  const { data: instructor, error } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, specialty")
    .eq("slug", params.slug)
    .single()

  if (error || !instructor) return notFound()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <p className="text-xs text-black/50">
        <Link href="/instructores" className="hover:underline">
          Instructores
        </Link>{" "}
        <span className="px-2">/</span>
        <span className="text-black/70">{instructor.name}</span>
      </p>

      <div className="mt-6 flex items-start justify-between gap-8">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-black">
            {instructor.name}
          </h1>
          {instructor.specialty ? (
            <p className="mt-2 text-sm text-black/60">{instructor.specialty}</p>
          ) : null}
        </div>

        <div className="h-20 w-20 overflow-hidden rounded-full border border-black/10 bg-black/5">
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

      <div className="mt-10 rounded-2xl border border-black/10 bg-white p-8">
        <h2 className="text-sm font-medium text-black">Biografía</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/70">
          {instructor.bio ?? "Este instructor aún no tiene biografía publicada."}
        </p>
      </div>
    </div>
  )
}
