import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ExperiencePage({ params }: { params: { experience: string } }) {
  const { experience } = params
  const supabase = await createClient()

  const formattedExp = experience.charAt(0).toUpperCase() + experience.slice(1).toLowerCase();

  const { data: programs } = await supabase
    .from("programs")
    .select("*, instructors(name)")
    .eq("experience_type", formattedExp)
    .eq("is_published", true)

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <h1 className="text-6xl font-cormorant italic capitalize mb-12">{experience}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {programs?.map((item) => (
          <Link href={`/programas/${item.slug}`} key={item.id} className="group flex flex-col gap-4">
            <div className="aspect-video bg-zinc-100 border border-zinc-100 rounded-sm overflow-hidden flex items-center justify-center">
               <span className="text-[10px] tracking-[0.3em] text-zinc-300 uppercase font-bold italic">Santuario Premium</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-cormorant italic text-zinc-900">{item.title}</h3>
              <p className="text-[10px] uppercase tracking-widest text-zinc-400">{item.instructors?.name} • {item.difficulty}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
