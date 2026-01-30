import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight } from "lucide-react"

export default async function AccesoFundadorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Only registered users can see this page
  if (!user) {
    redirect("/auth/registro")
  }

  // Check if user has active subscription
  // TODO: Replace with real subscription check when Stripe is integrated
  const hasSubscription = false

  // If user has subscription, redirect to dashboard
  if (hasSubscription) {
    redirect("/mi-santuario")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6">
          <Link href="/" className="font-serif text-2xl font-light tracking-wider">
            ALMA
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 lg:px-8 py-16 lg:py-24">
        {/* Hero - Oferta */}
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance mb-6">
            Acceso fundador a la plataforma de bienestar
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Prácticas reales para cuidar tu cuerpo y tu mente<br />
            desde cualquier lugar.
          </p>
          <div className="mb-8">
            <p className="text-3xl md:text-4xl font-light mb-2">USD 30</p>
            <p className="text-muted-foreground">acceso por 3 meses</p>
          </div>
          <Button size="lg" className="px-8 py-6 text-sm tracking-wider rounded-full">
            Unirme como fundador
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Qué incluye */}
        <div className="mb-16 p-8 lg:p-12 bg-secondary/50 border border-border/30 rounded-2xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Con tu acceso obtienes:</h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
              <span className="text-lg">3 programas iniciales</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
              <span className="text-lg">21 clases guiadas</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
              <span className="text-lg">Yoga, respiración, meditación y fitness consciente</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
              <span className="text-lg">Nuevas clases que se irán sumando</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
              <span className="text-lg">Precio fundador respetado mientras sigas activo</span>
            </li>
          </ul>
        </div>

        {/* Por qué ahora */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Por qué ahora</h2>
          <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
            <p>Este es el inicio del proyecto.<br />El acceso fundador está disponible por tiempo limitado.</p>
            <p>Cuando la plataforma crezca,<br />el precio cambiará.</p>
            <p>Si esto resuena contigo,<br />este es el momento de entrar.</p>
          </div>
        </div>

        {/* Para quién es */}
        <div className="mb-16 p-8 lg:p-12 bg-foreground text-background rounded-2xl">
          <h2 className="font-serif text-2xl md:text-3xl mb-6">Este acceso es ideal si:</h2>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 flex-shrink-0 mt-1" />
              <span>Ya sabes que el bienestar importa</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 flex-shrink-0 mt-1" />
              <span>Buscas estructura y claridad</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="h-5 w-5 flex-shrink-0 mt-1" />
              <span>Prefieres calidad sobre cantidad</span>
            </li>
          </ul>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Button size="lg" className="px-8 py-6 text-sm tracking-wider rounded-full mb-4">
            Acceder ahora · USD 30 / 3 meses
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="text-sm text-muted-foreground">
            Sin contratos largos · Acceso inmediato · Cancela cuando quieras
          </p>
        </div>
      </main>
    </div>
  )
}
