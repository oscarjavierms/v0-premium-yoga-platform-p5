import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Check, CreditCard, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Suscripción | Wellness Platform",
  description: "Gestiona tu plan de suscripción",
}

export default async function SuscripcionPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/suscripcion")
  }

  // For now, show a placeholder since Stripe is not connected
  const hasSubscription = false

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-medium">Mi Suscripción</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {hasSubscription ? (
          // Active subscription view
          <div className="max-w-2xl">
            <div className="bg-card border border-border rounded-xl p-6 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mb-2">
                    <Check className="w-3 h-3" />
                    Activa
                  </span>
                  <h2 className="font-serif text-2xl font-medium">Plan Anual</h2>
                </div>
                <CreditCard className="w-8 h-8 text-muted-foreground" />
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Precio</span>
                  <span className="font-medium">$99.99 / año</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Próxima renovación</span>
                  <span className="font-medium">12 de enero, 2027</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-muted-foreground">Método de pago</span>
                  <span className="font-medium">•••• 4242</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="bg-transparent">
                  Cambiar plan
                </Button>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
                >
                  Cancelar suscripción
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // No subscription view
          <div className="max-w-4xl">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-10 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-900 mb-1">No tienes una suscripción activa</h3>
                <p className="text-sm text-amber-700">
                  Actualmente tienes acceso limitado a clases gratuitas. Suscríbete para desbloquear todo el contenido.
                </p>
              </div>
            </div>

            {/* Pricing cards */}
            <h2 className="font-serif text-2xl font-medium mb-6">Elige tu plan</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Monthly */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-medium text-lg mb-2">Plan Mensual</h3>
                <div className="mb-4">
                  <span className="text-3xl font-medium">$14.99</span>
                  <span className="text-muted-foreground"> / mes</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Flexibilidad total, cancela cuando quieras</p>

                <ul className="space-y-3 mb-6">
                  {[
                    "Acceso a todas las clases",
                    "Nuevas clases cada semana",
                    "Seguimiento de progreso",
                    "Sin anuncios",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="outline" className="w-full bg-transparent">
                  Elegir mensual
                </Button>
              </div>

              {/* Annual */}
              <div className="bg-card border-2 border-foreground rounded-xl p-6 relative">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-foreground text-background text-xs font-medium rounded-full">
                  Ahorra 30%
                </div>

                <h3 className="font-medium text-lg mb-2">Plan Anual</h3>
                <div className="mb-4">
                  <span className="text-3xl font-medium">$99.99</span>
                  <span className="text-muted-foreground"> / año</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">Equivale a $8.33/mes - el mejor valor</p>

                <ul className="space-y-3 mb-6">
                  {[
                    "Todo lo del plan mensual",
                    "Acceso a programas exclusivos",
                    "Contenido descargable",
                    "Soporte prioritario",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button className="w-full">Elegir anual</Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Los pagos se procesan de forma segura. Puedes cancelar en cualquier momento.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
