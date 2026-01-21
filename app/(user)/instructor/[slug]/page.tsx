export const dynamic = "force-dynamic"
export const revalidate = 0

import { createServerClient } from "@/lib/supabase/server"

type Params = { slug: string }

export default async function Page(props: { params: Params | Promise<Params> }) {
  const supabase = await createServerClient()

  // ✅ Next puede entregar params como Promise en algunas versiones/builds
  const params = await props.params

  const slug = (params?.slug ?? "").toString().trim().toLowerCase()

  const { data: one, error: oneError } = await supabase
    .from("instructors")
    .select("id, slug, name, bio, specialty")
    .eq("slug", slug)
    .maybeSingle()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-light text-black">INSTRUCTOR</h1>

      <pre className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-xs text-black/80 overflow-auto">
        {JSON.stringify(
          {
            slugRequested: slug,
            one,
            oneError,
          },
          null,
          2
        )}
      </pre>
    </main>
  )
}
