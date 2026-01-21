export function ProblemSection() {
  const problems = [
    {
      title: "Cansancio Mental",
      description: "Mente acelerada, dificultad para desconectarse, sueño irregular.",
    },
    {
      title: "Dolor Físico",
      description: "Espalda rígida, cuello cargado, caderas bloqueadas por el sedentarismo.",
    },
    {
      title: "Culpa Constante",
      description: "Sabes que debes cuidarte pero no encuentras opciones compatibles con tu agenda.",
    },
    {
      title: "Sin Identidad",
      description: "No te identificas con lo místico. Buscas funcionalidad, no discursos vacíos.",
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">El problema</p>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
            El éxito profesional no debería costar tu salud
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Las soluciones actuales son demasiado místicas, demasiado largas, o poco compatibles con la vida real de un
            profesional exigente.
          </p>
        </div>

        {/* Problem Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
          {problems.map((problem, index) => (
            <div key={index} className="bg-background p-8 lg:p-12">
              <span className="text-xs tracking-widest text-muted-foreground">0{index + 1}</span>
              <h3 className="mt-4 text-xl font-medium">{problem.title}</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed">{problem.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
