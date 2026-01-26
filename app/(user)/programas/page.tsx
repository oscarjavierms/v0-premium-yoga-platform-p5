import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export default async function ProgramsPage() {
  const supabase = await createClient()
  
  // Traemos los programas de la base de datos
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .eq("is_published", true)

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
      {programs?.map((program) => (
        <Link href={`/programas/${program.slug}`} key={program.id}>
          <div className="border rounded-xl p-4 hover:shadow-lg transition">
            <h3 className="text-xl font-bold">{program.title}</h3>
            <p className="text-sm text-gray-500">{program.experience_type}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
