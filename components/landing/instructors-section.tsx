const instructors = [
  {
    name: "María García",
    specialty: "Yoga & Movilidad",
    bio: "15 años de experiencia. Especialista en yoga funcional para profesionales.",
    image: "/yoga-instructor-woman-elegant-portrait-black-and-w.jpg",
  },
  {
    name: "Carlos Ruiz",
    specialty: "Respiración & Meditación",
    bio: "Experto en técnicas de respiración para regulación del sistema nervioso.",
    image: "/meditation-instructor-man-portrait-black-and-white.jpg",
  },
  {
    name: "Ana Torres",
    specialty: "Movilidad Funcional",
    bio: "Fisioterapeuta deportiva. Especialista en desbloqueo corporal.",
    image: "/fitness-instructor-woman-portrait-black-and-white.jpg",
  },
  {
    name: "David López",
    specialty: "Mindfulness",
    bio: "Coach de alto rendimiento. Meditación aplicada al mundo empresarial.",
    image: "/mindfulness-coach-man-portrait-black-and-white-ele.jpg",
  },
]

export function InstructorsSection() {
  return (
    <section id="profesores" className="py-24 lg:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Los profesores</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
            Expertos que entienden tu realidad
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Profesionales con autoridad real. Sin ego. Enfocados en resultados que puedas medir.
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {instructors.map((instructor, index) => (
            <div key={index} className="group">
              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={instructor.image || "/placeholder.svg"}
                  alt={instructor.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Info */}
              <div className="mt-6">
                <h3 className="text-lg font-medium">{instructor.name}</h3>
                <p className="text-xs tracking-wide uppercase text-muted-foreground mt-1">{instructor.specialty}</p>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{instructor.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
