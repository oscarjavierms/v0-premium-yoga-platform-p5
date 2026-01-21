export const dynamic = "force-dynamic"
export const revalidate = 0

import { createServerClient } from "@/lib/supabase/server"

export default async function Page({ params }: { params: { slug: string } }) {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from("instructors")
    .select("id, name, slug")
    .eq("slug", params.slug)
    .maybeSingle()

  return (
    <main style={{ padding: 40 }}>
      <h1>DEBUG INSTRUCTOR</h1>
      <pre style={{ marginTop: 20 }}>
        {JSON.stringify({ slug: params.slug, data, error }, null, 2)}
      </pre>
    </main>
  )
}
