export function ManifestoSection() {
  return (
    <section className="py-24 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl tracking-tight text-balance mb-8">
            Para quién es
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-lg font-medium mb-4">Este espacio es para ti si:</h3>
            <ul className="space-y-3 text-background/80 leading-relaxed">
              <li>• Quieres cuidarte sin presión</li>
              <li>• Valoras la calma y la claridad</li>
              <li>• Buscas algo que puedas sostener en el tiempo</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">No es para ti si:</h3>
            <ul className="space-y-3 text-background/80 leading-relaxed">
              <li>• Buscas resultados extremos rápidos</li>
              <li>• Te motivan discursos agresivos</li>
              <li>• Quieres competir o compararte</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
