import { createClient } from "@/lib/supabase/server"
import { ClassesClient } from "./classes-client"

export const metadata = {
  title: "Gestionar Clases | Admin",
}

export default async function AdminClasesPage() {
  const supabase = await createClient()

  const [{ data: classes }, { data: instructors }, { data: programs }] = await Promise.all([
    supabase
      .from("classes")
      .select(
        `
      *,
      instructor:instructors(name),
      program:programs(title)
    `,
      )
      .order("created_at", { ascending: false }),
    supabase.from("instructors").select("id, name").order("name"),
    supabase.from("programs").select("id, title").order("title"),
  ])

  return (
    <div className="p-4 lg:p-8">
      <ClassesClient classes={classes || []} instructors={instructors || []} programs={programs || []} />
    </div>
  )
}
