import { createClient } from "@/lib/supabase/server"
import { InstructorsClient } from "./instructors-client"

export const metadata = {
  title: "Gestionar Profesores | Admin",
}

export default async function AdminInstructoresPage() {
  const supabase = await createClient()

  const { data: instructors } = await supabase.from("instructors").select("*").order("name", { ascending: true })

  const instructorsWithStats = await Promise.all(
    (instructors || []).map(async (instructor) => {
      const { count } = await supabase
        .from("classes")
        .select("*", { count: "exact", head: true })
        .eq("instructor_id", instructor.id)

      return {
        ...instructor,
        classCount: count || 0,
      }
    }),
  )

  return (
    <div className="p-4 lg:p-8">
      <InstructorsClient instructors={instructorsWithStats} />
    </div>
  )
}
