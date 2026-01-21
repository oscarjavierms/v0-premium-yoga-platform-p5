import { createServerClient } from "@/lib/supabase/server"

export default async function InstructorPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-serif tracking-tight text-black">
        Instructor: {params.slug}
      </h1>

      <p className="mt-4 text-sm text-black/60">
        Esta es una página de prueba. Si esto ya NO sale 404, la ruta está bien.
      </p>
    </main>
  )
}
