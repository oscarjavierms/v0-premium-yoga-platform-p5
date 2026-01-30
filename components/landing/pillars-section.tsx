import { Brain, Wind, Move } from "lucide-react"

const pillars = [
  {
    icon: Move,
    title: "Yoga",
    description: "Movimiento consciente para fuerza, movilidad y presencia.",
  },
  {
    icon: Wind,
    title: "Respiración & Meditación",
    description: "Prácticas para regular el sistema nervioso y enfocar la mente.",
  },
  {
    icon: Brain,
    title: "Fitness consciente",
    description: "Entrenamiento funcional que acompaña al cuerpo, no lo castiga.",
  },
]

export function PillarsSection() {
  return (
    <section id="metodo" className="py-24 lg:py-32 bg-secondary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
            Aquí no tienes que elegir entre cientos de clases.
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Todo está pensado para que entres, practiques<br/>
            y sigas con tu día.
          </p>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Prácticas guiadas, programas claros<br/>
            y un enfoque que prioriza la constancia,<br/>
            no la exigencia.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
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

        <p className="mt-12 text-center text-sm text-muted-foreground italic">
          (La plataforma crecerá con nuevas prácticas y experiencias)
        </p>
      </div>
    </section>
  )
}
