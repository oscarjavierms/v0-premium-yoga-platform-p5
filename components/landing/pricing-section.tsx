import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const features = [
  "Acceso ilimitado a todas las clases",
  "Nuevos contenidos cada semana",
  "Programas estructurados por objetivo",
  "Seguimiento de progreso personal",
  "Comunidad privada de miembros",
  "Sesiones en vivo mensuales",
  "Descarga offline en la app",
  "Cancela cuando quieras",
]

export function PricingSection() {
  return (
    <section id="membresia" className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">Membresía</p>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
              Invierte en tu activo más importante
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Tu cuerpo y tu mente son los cimientos de tu rendimiento. Una inversión que se paga sola.
            </p>

            <ul className="mt-10 space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0" />
                  <span className="text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right - Pricing Cards */}
          <div className="space-y-6">
            {/* Monthly */}
            <div className="p-8 border border-border hover:border-foreground/20 transition-colors">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg font-medium">Mensual</h3>
                  <p className="text-sm text-muted-foreground mt-1">Flexibilidad total</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-serif">$29</p>
                  <p className="text-xs text-muted-foreground">USD/mes</p>
                </div>
              </div>
              <Link href="/registro?plan=monthly" className="block mt-6">
                <Button variant="outline" className="w-full tracking-wide uppercase bg-transparent">
                  Comenzar
                </Button>
              </Link>
            </div>

            {/* Annual - Featured */}
            <div className="p-8 bg-foreground text-background">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-background text-foreground text-xs tracking-wide uppercase">
                  Ahorra 40%
                </span>
                <span className="text-xs text-background/60">Más popular</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg font-medium">Anual</h3>
                  <p className="text-sm text-background/60 mt-1">Compromiso con resultados</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-serif">$199</p>
                  <p className="text-xs text-background/60">USD/año</p>
                </div>
              </div>
              <Link href="/registro?plan=annual" className="block mt-6">
                <Button className="w-full bg-background text-foreground hover:bg-background/90 tracking-wide uppercase">
                  Comenzar ahora
                </Button>
              </Link>
              <p className="mt-4 text-xs text-background/60 text-center">Equivale a $16.58/mes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
