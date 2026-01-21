import { notFound } from "next/navigation"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructorProfilePage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  const { data: instructor, error } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, focus")
    .eq("slug", params.slug)
    .single()

  if (error || !instructor) return notFound()

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      <p className="text-xs text-neutral-500">
        <Link href="/instructores" className="hover:underline">
          Instructores
        </Link>{" "}
        <span className="px-2">/</span>
        <span className="text-neutral-700">{instructor.name}</span>
      </p>

      <h1 className="mt-3 font-serif text-4xl tracking-tight">
        {instructor.name}
      </h1>
      <p className="mt-3 text-sm text-neutral-600">
        {instructor.focus ?? "Instructor"}
      </p>

      <div className="mt-10 rounded-2xl border border-black/10 bg-white p-8">
        <h2 className="text-sm font-medium text-black">Sobre</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-700">
          {instructor.bio ?? "Este instructor aún no tiene biografía publicada."}
        </p>
      </div>
    </div>
  )
}

