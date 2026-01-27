import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SectionHero } from "@/components/ui/section-hero"
import Link from "next/link"

// ✅ Esto asegura que al publicar en el Admin, el cambio sea instantáneo
export const revalidate = 0

export default async function MeditacionPage() {
  const supabase = await createClient()
  
  // 1. Verificación de seguridad
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  // 2. Consulta idéntica a Yoga pero filtrando por "Meditación"
  // Nota: Usamos 'instructor:instructor_id' para traer el nombre del instructor correctamente
  const { data: programs } = await supabase
    .from("programs")
    .select(`
      *,
      instructor:instructor_id(name)
    `)
    .eq("experience_type", "Meditación") 
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  return (
    <div className="relative -mt-32">
      {/* HERO: Mismo estilo que Yoga pero con tu imagen de Meditación */}
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] overflow-hidden">
        <SectionHero 
          title="Meditación" 
          subtitle="EL SILENCIO ES EL LENGUAJE DEL ALMA" 
          image="/minimalista-me.png" 
          align="center" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        {/* ENCABEZADO: Copiado de la estructura de Yoga */}
        <header className="mb-12">
          <h1 className="text-5xl font-cormorant text-zinc-900 mb-2">Meditación</h1>
          <p className="text-zinc-500 font-light italic text-lg">Encuentra calma y claridad mental</p>
        </header>

        {/* GRILLA: Estructura idéntica a Yoga para conservar el diseño */}
        {programs && programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
            {programs.map((program) => (
              <Link 
                href={`/programas/${program.slug}`} 
                key={program.id} 
                className="group flex flex-col gap-4"
              >
                {/* Portada con el estilo "Santuario Program" */}
                <div className="aspect-video bg-zinc-100 rounded-sm overflow-hidden relative border border-zinc-50 transition-all group-hover:shadow-md">
                   <div className="w-full h-full flex items-center justify-center bg-zinc-50 text-zinc-300">
                      <span className="text-[10px] tracking-[0.3em] uppercase font-bold">
                        Santuario Program
                      </span>
                   </div>
                   <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-0.5 rounded text-[10px] text-white font-medium uppercase tracking-widest">
                     Program
                   </div>
                </div>

                {/* Info del programa */}
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-zinc-900 leading-tight group-hover:text-zinc-500 transition-colors">
                    {program.title}
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-light tracking-wide uppercase">
                    {/* Accedemos al nombre del instructor mapeado */}
                    <span>{program.instructor?.name || "Instructor"}</span>
                    <span className="flex items-center gap-1.5 uppercase tracking-widest">
                      <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                      {program.practice_level || "Todos"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-t border-zinc-50">
            <p className="font-cormorant italic text-zinc-300 text-2xl">
              Nuevas meditaciones en curación editorial...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
