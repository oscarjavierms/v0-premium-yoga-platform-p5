import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden bg-black p-12 lg:p-20 rounded-3xl">
          <div className="relative z-10 max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-white text-balance">
              El bienestar no debería sentirse como una obligación.
            </h2>
            <p className="mt-6 text-lg text-white/60 leading-relaxed font-light italic">
              Debería sentirse como un lugar al que quieres volver.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/auth/registro">
                <Button size="lg" className="px-8 py-6 text-[10px] tracking-[0.2em] uppercase font-bold bg-white text-black hover:bg-white/90 rounded-full">
                  Conocer la plataforma
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:block">
            <img 
              src="/yoga-silhouette-elegant-black-and-white-minimal.jpg" 
              alt="" 
              className="w-full h-full object-cover opacity-40 grayscale" 
            />
          </div>
        </div>
      </div>
    </section>
  )
}
