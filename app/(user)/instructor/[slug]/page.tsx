export const dynamic = "force-dynamic"
export const revalidate = 0

import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = await createServerClient()

  const envUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "NO_ENV_URL"

  // 1) prueba listar slugs disponibles (esto mata la duda)
  const { data: all, error: allError } = await supabase
    .from("instructors")
    .select("id, slug, name")
    .order("name", { ascending: true })

  // 2) busca el slug que estás pidiendo
  const { data: one, error: oneError } = await supabase
    .from("instructors")
    .select("id, slug, name")
    .eq("slug", params.slug)
    .maybeSingle()


  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-light text-black">DEBUG DEFINITIVO</h1>

      <pre className="mt-6 rounded-2xl border border-black/10 bg-white p-6 text-xs text-black/80 overflow-auto">
        {JSON.stringify(
          {
            slugRequested: params.slug,
            envUrl,
            allCount: all?.length ?? null,
            allError,
            allFirst5: all?.slice(0, 5) ?? null,
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
