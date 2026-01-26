import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ExperiencePage({ params }: { params: { experience: string } }) {
  const { experience } = params
  const supabase = await createClient()

  // Validamos que la experiencia sea una de las tres permitidas
  const validExperiences = ["yoga", "meditacion", "fitness"]
  if (!validExperiences.includes(experience.toLowerCase())) {
    notFound()
  }

  // Traemos los programas y clases que coincidan con la categoría
  const { data: contents, error } = await supabase
    .from("programs")
    .select("*")
    .eq("experience_type", experience.charAt(0).toUpperCase() + experience.slice(1)) // Yoga, Meditacion, etc.
    .eq("is_published", true)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <header className="mb-10">
        <h1 className="text-5xl font-serif capitalize">{experience}</h1>
        <p className="text-gray-400 mt-2">Explora nuestras sesiones de {experience} premium.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {contents?.map((item) => (
          <Link href={`/programas/${item.slug}`} key={item.id} className="group">
            <div className="aspect-video bg-zinc-900 rounded-2xl mb-4 overflow-hidden border border-zinc-800 transition-all group-hover:border-gold">
               {/* Aquí irá la miniatura del video de Vimeo más adelante */}
               <div className="w-full h-full flex items-center justify-center text-zinc-700">
                 {item.is_standalone_class ? "Clase Individual" : "Programa"}
               </div>
            </div>
            <h3 className="text-xl font-bold">{item.title}</h3>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-gray-300">{item.difficulty}</span>
              <span className="text-xs px-2 py-1 bg-zinc-800 rounded text-gray-300">{item.focus_area}</span>
            </div>
          </Link>
        ))}
      </div>

      {contents?.length === 0 && (
        <div className="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
          <p className="text-zinc-500">Próximamente habrá contenido nuevo en esta sección.</p>
        </div>
      )}
    </div>
  )
}
