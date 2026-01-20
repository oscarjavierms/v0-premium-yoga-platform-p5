import { createClient } from "@/lib/supabase/server"
import { ProgramsClient } from "./programs-client"

export const metadata = {
  title: "Gestionar Programas | Admin",
}

export default async function AdminProgramasPage() {
  const supabase = await createClient()

  const [{ data: programs }, { data: instructors }] = await Promise.all([
    supabase
      .from("programs")
      .select(
        `
      *,
      instructor:instructors(name)
    `,
      )
      .order("created_at", { ascending: false }),
    supabase.from("instructors").select("id, name").order("name"),
  ])

  const programsWithStats = await Promise.all(
    (programs || []).map(async (program) => {
      const { count } = await supabase
        .from("classes")
        .select("*", { count: "exact", head: true })
        .eq("program_id", program.id)

      return {
        ...program,
        classCount: count || 0,
      }
    }),
  )

  return (
    <div className="p-4 lg:p-8">
      <ProgramsClient programs={programsWithStats} instructors={instructors || []} />
    </div>
  )
}
