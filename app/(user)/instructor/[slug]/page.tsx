export const dynamic = "force-dynamic"
export const revalidate = 0

import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = await createServerClient()

  // ✅ slug real recibido
  const rawSlug = params.slug

  // ✅ slug normalizado (esto debe coincidir con supabase)
  const cleanSlug = decodeURIComponent(rawSlug).trim().toLowerCase()

  const { data: all, error: allError } = await supabase
    .from("instructors")
    .select("id, slug, name")
    .order("name", { ascending: true })

  const { data: one, error: oneError } = await supabase
    .from("instructors")
    .select("id, slug, name")
    .eq("slug", cleanSlug)
    .maybeSingle()

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-light text-black">DEBUG DEFINITIVO (REAL)</h1>

      <pre className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-xs text-black/80 overflow-auto">
        {JSON.stringify(
          {
            rawSlug,
            rawSlugLength: rawSlug.length,
            rawSlugCharCodes: rawSlug.split("").map((c) => c.charCodeAt(0)),
            cleanSlug,
            cleanSlugLength: cleanSlug.length,
            allCount: all?.length ?? null,
            allError,
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
