import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ExperiencePage({ params }: { params: { experience: string } }) {
  const { experience } = params
  const supabase = await createClient()

  const validExperiences = ["yoga", "meditacion", "fitness"]
  if (!validExperiences.includes(experience.toLowerCase())) notFound()

  const { data: contents } = await supabase
    .from("programs")
    .select("*, instructors(name)")
    .eq("experience_type", experience.charAt(0).toUpperCase() + experience.slice(1))
    .eq("is_published", true)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-serif capitalize mb-10">{experience}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contents?.map((item) => (
          <Link href={`/programas/${item.slug}`} key={item.id} className="group">
            <div className="aspect-video bg-zinc-100 rounded-2xl mb-4 overflow-hidden border border-zinc-200 group-hover:shadow-xl transition-all">
               {/* Aquí se renderizará la miniatura de Vimeo más adelante */}
               <div className="w-full h-full flex items-center justify-center text-zinc-400 italic">
                 {item.category || "Premium Content"}
               </div>
            </div>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.instructors?.name}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
