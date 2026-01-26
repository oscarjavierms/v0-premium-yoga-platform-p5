import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function ExperiencePage({ params }: { params: { experience: string } }) {
  const { experience } = params
  const supabase = await createClient()

  const validExperiences = ["yoga", "meditacion", "fitness"]
  if (!validExperiences.includes(experience.toLowerCase())) notFound()

  // Formatear para el filtro de Supabase (Primera letra mayúscula)
  const experienceType = experience.charAt(0).toUpperCase() + experience.slice(1).replace("on", "ón")

  const { data: contents } = await supabase
    .from("programs")
    .select("*, instructors(name)")
    .eq("experience_type", experienceType)
    .eq("is_published", true) // Solo mostrar si está publicado
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <header className="mb-16">
        <h1 className="text-6xl font-serif capitalize mb-4">{experience}</h1>
        <p className="text-zinc-500 text-lg max-w-2xl">
          Descubre contenidos exclusivos de {experience} diseñados para elevar tu práctica diaria.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {contents?.map((item) => (
          <Link href={`/programas/${item.slug}`} key={item.id} className="group flex flex-col gap-4">
            <div className="aspect-[16/9] bg-zinc-100 rounded-3xl overflow-hidden border border-zinc-200 relative">
              {/* Overlay suave al hacer hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors z-10" />
              
              <div className="absolute top-4 right-4 z-20">
                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                  {item.category || "Premium"}
                </span>
              </div>
              
              <div className="w-full h-full flex items-center justify-center text-zinc-300">
                {/* Aquí cargaremos el thumbnail de Vimeo después */}
                <span className="text-xs uppercase font-medium tracking-tighter italic">Vimeo Preview</span>
              </div>
            </div>

            <div className="px-1">
              <h3 className="text-2xl font-bold tracking-tight group-hover:underline decoration-1 underline-offset-4">
                {item.title}
              </h3>
              <p className="text-zinc-500 text-sm line-clamp-2 mt-2 leading-relaxed">
                {item.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                  {item.instructors?.name}
                </span>
                {item.total_classes > 0 && (
                  <span className="text-[10px] bg-zinc-100 px-2 py-1 rounded text-zinc-600 font-bold">
                    {item.total_classes} CLASES
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {(!contents || contents.length === 0) && (
        <div className="py-24 text-center border-2 border-dashed rounded-3xl border-zinc-100">
          <p className="text-zinc-400 font-medium italic">Próximamente nuevos programas de {experience}.</p>
        </div>
      )}
    </div>
  )
}
