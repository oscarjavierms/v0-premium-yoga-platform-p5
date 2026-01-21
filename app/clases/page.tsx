import { createClient } from "@/lib/supabase/server"
import ClassesClient from "./classes-client"

export const metadata = {
  title: "Clases | Wellness Platform",
  description: "Explora nuestra biblioteca de clases de yoga, meditación, respiración y más.",
}

async function getClasses() {
  const supabase = await createClient()

  const { data: classes, error } = await supabase
    .from("classes")
    .select(`
      *,
      instructor:instructors(id, name, slug, avatar_url),
      program:programs(id, title, slug)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching classes:", error)
    return []
  }

  return classes
}

export default async function ClasesPage() {
  const classes = await getClasses()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium mb-4">Biblioteca de Clases</h1>
          <p className="text-lg md:text-xl text-background/70 max-w-2xl">
            Encuentra la práctica perfecta para cada momento. Filtra por categoría, nivel o duración para descubrir
            clases que se adapten a tu tiempo y necesidades.
          </p>
        </div>
      </section>

      <ClassesClient initialClasses={classes} />
    </main>
  )
}
