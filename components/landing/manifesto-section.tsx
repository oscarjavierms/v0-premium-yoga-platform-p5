export function ManifestoSection() {
  return (
    <section className="py-24 lg:py-32 bg-foreground text-background">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-background/60 mb-8">Nuestro manifiesto</p>

        <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight text-balance">
          "No vendemos iluminación. Vendemos claridad, energía y estabilidad. Somos el puente entre el mundo del negocio
          y el mat."
        </blockquote>

        <div className="mt-12 space-y-6 text-lg text-background/70 leading-relaxed max-w-2xl mx-auto">
          <p>No es una app de yoga. No es fitness. No es meditación tradicional.</p>
          <p className="text-background font-medium">Es un sistema de bienestar para personas que lideran.</p>
        </div>
      </div>
    </section>
  )
}
