import Link from "next/link"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"

export default async function InstructorPage({
  params,
}: {
  params: { slug: string }
}) {
  const supabase = await createServerClient()

  // 1) Buscar instructor por slug
  const { data: instructor, error: instructorError } = await supabase
    .from("instructors")
    .select("id, name, slug, bio, avatar_url, specialty")
    .eq("slug", params.slug)
    .single()

  if (instructorError || !instructor) return notFound()

  // 2) Traer clases publicadas del instructor
  const { data: classes, error: classesError } = await supabase
    .from("classes")
    .select("id, title, slug, is_free, is_published, program_id, program_order")
    .eq("instructor_id", instructor.id)
    .eq("is_published", true)
    .order("program_order", { ascending: true })

  const safeClasses = classesError ? [] : classes ?? []

  // 3) Traer programas (desde los program_id en clases)
  const programIds = Array.from(
    new Set(safeClasses.map((c) => c.program_id).filter(Boolean))
  ) as string[]

  const { data: programs } =
    programIds.length > 0
      ? await supabase
          .from("programs")
          .select("id, title, slug")
          .in("id", programIds)
      : { data: [] as any[] }

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-12">
      {/* Breadcrumb */}
      <div className="text-xs text-black/50">
        <Link href="/instructores" className="hover:underline">
          Instructores
        </Link>
        <span className="px-2">/</span>
        <span className="text-black/70">{instructor.name}</span>
      </div>

      {/* Header */}
      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-black md:text-5xl">
            {instructor.name}
          </h1>

          {instructor.specialty ? (
            <p className="mt-3 text-sm text-black/60">{instructor.specialty}</p>
          ) : (
            <p className="mt-3 text-sm text-black/60">Instructor</p>
          )}
        </div>

