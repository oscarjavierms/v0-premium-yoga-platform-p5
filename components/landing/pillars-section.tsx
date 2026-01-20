import { Brain, Wind, Move, Dumbbell, Heart, Sparkles } from "lucide-react"

const pillars = [
  {
    icon: Move,
    title: "Yoga Funcional",
    description: "Secuencias diseñadas para contrarrestar los efectos del trabajo sedentario.",
  },
  {
    icon: Brain,
    title: "Meditación Aplicada",
    description: "Técnicas prácticas para claridad mental y toma de decisiones.",
  },
  {
    icon: Wind,
    title: "Respiración Consciente",
    description: "Protocolos de respiración para regular el sistema nervioso.",
  },
  {
    icon: Sparkles,
    title: "Movilidad Inteligente",
    description: "Rutinas cortas para desbloquear caderas, espalda y cuello.",
  },
  {
    icon: Dumbbell,
    title: "Fitness Consciente",
    description: "Entrenamiento que fortalece sin agotar, sostenible a largo plazo.",
  },
  {
    icon: Heart,
    title: "Hábitos & Regulación",
    description: "Sistema nervioso equilibrado para sostener el rendimiento.",
  },
]

export function PillarsSection() {
  return (
    <section id="metodo" className="py-24 lg:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">El método</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
            Un sistema completo de bienestar funcional
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            No es hacer ejercicio. Es recalibrar cuerpo y mente para sostener el rendimiento a largo plazo.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="group p-8 bg-background border border-border hover:border-foreground/20 transition-colors duration-300"
            >
              <pillar.icon className="h-8 w-8 text-foreground/70 group-hover:text-foreground transition-colors" />
              <h3 className="mt-6 text-lg font-medium">{pillar.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
