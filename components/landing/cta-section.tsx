import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden bg-secondary p-12 lg:p-20">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-balance">
              Comienza tu transformación hoy
            </h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              7 días de prueba gratuita. Sin compromiso. Cancela cuando quieras.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/registro">
                <Button size="lg" className="px-8 py-6 text-sm tracking-wide uppercase">
                  Comenzar gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#clases">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 text-sm tracking-wide uppercase bg-transparent"
                >
                  Explorar clases
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
            <img src="/yoga-silhouette-elegant-black-and-white-minimal.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          </div>
        </div>
      </div>
    </section>
  )
}
