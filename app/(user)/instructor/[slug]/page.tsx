export const dynamic = "force-dynamic"
export const revalidate = 0

import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: { slug?: string } }) {
  const supabase = await createServerClient()

  const rawSlug = typeof params?.slug === "string" ? params.slug : "NO_SLUG"

  let cleanSlug = rawSlug
  try {
    cleanSlug = decodeURIComponent(rawSlug).trim().toLowerCase()
  } catch (e) {
    cleanSlug = rawSlug.trim().toLowerCase()
  }

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
      <h1 className="text-3xl font-light text-black">DEBUG DEFINITIVO (SAFE)</h1>

      <pre className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-xs text-black/80 overflow-auto">
        {JSON.stringify(
          {
            rawSlug,
            cleanSlug,
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
