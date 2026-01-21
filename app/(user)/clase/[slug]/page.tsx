import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ClaseClient } from "./clase-client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()
  
  const { data: classData } = await supabase
    .from("classes")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  return {
    title: classData?.title || "Clase",
    description: classData?.description,
  }
}

export default async function ClasePage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get class with instructor
  const { data: classData } = await supabase
    .from("classes")
    .select(`
      *,
      instructors (
        id,
        name,
        slug,
        bio,
        avatar_url
      ),
      programs (
        id,
        title,
        slug
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!classData) {
    notFound()
  }

  // Get user progress for this class (may not exist yet)
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("class_id", classData.id)
    .maybeSingle()

  // Check if saved (may not exist)
  const { data: saved } = await supabase
    .from("user_practice_saved_classes")
    .select("id")
    .eq("user_id", user.id)
    .eq("class_id", classData.id)
    .maybeSingle()

  // Get related classes (same pillar or program)
  const { data: relatedClasses } = await supabase
    .from("classes")
    .select(`
      id,
      title,
      slug,
      thumbnail_url,
      duration_minutes,
      pillar,
      instructors (name)
    `)
    .eq("is_published", true)
    .neq("id", classData.id)
    .or(`pillar.eq.${classData.pillar},program_id.eq.${classData.program_id}`)
    .limit(4)

  return (
    <ClaseClient
      classData={classData}
      userId={user.id}
      initialProgress={progress}
      initialSaved={!!saved}
      relatedClasses={relatedClasses || []}
    />
  )
}
