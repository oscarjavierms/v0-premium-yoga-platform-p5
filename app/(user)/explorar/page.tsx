import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ExplorarClient } from "./explorar-client"

export const metadata = {
  title: "Explorar | Descubre nuevas clases",
}

interface Props {
  searchParams: Promise<{ categoria?: string; nivel?: string }>
}

export default async function ExplorarPage({ searchParams }: Props) {
  const params = await searchParams
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Build query
  let query = supabase
    .from("classes")
    .select(`
      id,
      title,
      slug,
      thumbnail_url,
      duration_minutes,
      difficulty,
      pillar,
      is_free,
      instructors (name)
    `)
    .eq("is_published", true)

  if (params.categoria) {
    query = query.eq("pillar", params.categoria)
  }

  if (params.nivel) {
    query = query.eq("difficulty", params.nivel)
  }

  const { data: classes } = await query.order("created_at", { ascending: false })

  // Get unique pillars and difficulties for filters
  const { data: allClasses } = await supabase
    .from("classes")
    .select("pillar, difficulty")
    .eq("is_published", true)

  const pillars = [...new Set(allClasses?.map(c => c.pillar).filter(Boolean))]
  const difficulties = [...new Set(allClasses?.map(c => c.difficulty).filter(Boolean))]

  return (
    <ExplorarClient
      classes={classes || []}
      pillars={pillars}
      difficulties={difficulties}
      initialFilters={{
        categoria: params.categoria || "",
        nivel: params.nivel || "",
      }}
    />
  )
}
