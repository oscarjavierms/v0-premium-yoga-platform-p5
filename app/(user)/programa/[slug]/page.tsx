import { createServerClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { ProgramaDetailClient } from "./programa-detail-client"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()
  
  const { data: program } = await supabase
    .from("programs")
    .select("title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  return {
    title: program?.title || "Programa",
    description: program?.description,
  }
}

export default async function ProgramaPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get program with instructor
  const { data: program } = await supabase
    .from("programs")
    .select(`
      *,
      instructors (
        id,
        name,
        slug,
        bio,
        avatar_url
      )
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (!program) {
    notFound()
  }

  // Get classes for this program
  const { data: classes } = await supabase
    .from("classes")
    .select(`
      id,
      title,
      slug,
      thumbnail_url,
      duration_minutes,
      difficulty,
      pillar,
      program_order,
      instructors (name)
    `)
    .eq("program_id", program.id)
    .eq("is_published", true)
    .order("program_order", { ascending: true })

  // Get user progress for program classes
  const classIds = classes?.map(c => c.id) || []
  const { data: progressData } = await supabase
    .from("user_progress")
    .select("class_id, completed, progress_seconds")
    .eq("user_id", user.id)
    .in("class_id", classIds)

  // Check if program is saved
  const { data: saved } = await supabase
    .from("user_practice_saved_programs")
    .select("id")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .single()

  // Build progress map
  const progressMap = new Map(
    progressData?.map(p => [p.class_id, p]) || []
  )

  const classesWithProgress = classes?.map(c => ({
    ...c,
    progress: progressMap.get(c.id) || null,
  })) || []

  // Calculate completion stats
  const completedCount = progressData?.filter(p => p.completed).length || 0
  const totalClasses = classes?.length || 0

  return (
    <ProgramaDetailClient
      program={program}
      classes={classesWithProgress}
      userId={user.id}
      initialSaved={!!saved}
      stats={{
        completedClasses: completedCount,
        totalClasses,
        completionPercentage: totalClasses > 0 ? Math.round((completedCount / totalClasses) * 100) : 0,
      }}
    />
  )
}
