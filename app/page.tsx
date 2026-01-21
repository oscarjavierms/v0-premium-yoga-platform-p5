import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - B&W Luxury */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-white/95 border-b border-black/5">
        <div className="container mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full border border-black/80 flex items-center justify-center transition-transform hover:scale-105">
              <span className="font-serif text-sm">S</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm font-light transition-colors">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/registro">
              <Button className="rounded-full px-6 text-sm font-light bg-black text-white hover:bg-black/90 transition-all">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 md:px-8 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-light text-black tracking-tight mb-6">
            Tu Santuario Digital
          </h1>
          <p className="text-lg md:text-xl text-black/60 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
            Un espacio de práctica consciente donde yoga, meditación y fitness se unen para transformar tu día
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/auth/registro">
              <Button size="lg" className="rounded-full px-8 bg-black text-white hover:bg-black/90 transition-all">
                Comenzar ahora
              </Button>
            </Link>
            <Link href="/mi-santuario">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-black/20 hover:bg-black/5 transition-all">
                Explorar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 md:px-8 py-20 border-t border-black/5">
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-2xl">Y</span>
            </div>
            <h3 className="font-serif text-2xl font-light mb-3">Yoga</h3>
            <p className="text-black/60 font-light leading-relaxed">
              Prácticas para fortalecer cuerpo y mente con conciencia plena
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-2xl">M</span>
            </div>
            <h3 className="font-serif text-2xl font-light mb-3">Meditación</h3>
            <p className="text-black/60 font-light leading-relaxed">
              Momentos de calma para cultivar paz interior y claridad mental
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full border border-black/10 flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-2xl">F</span>
            </div>
            <h3 className="font-serif text-2xl font-light mb-3">Fitness</h3>
            <p className="text-black/60 font-light leading-relaxed">
              Entrenamientos funcionales para vitalidad y energía sostenible
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 py-12">
        <div className="container mx-auto px-6 md:px-8 text-center">
          <p className="text-sm text-black/40 font-light">
            © 2025 Mi Santuario. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
