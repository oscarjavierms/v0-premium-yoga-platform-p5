"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function PaywallPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login?redirect=/paywall")
        return
      }

      setUser(user)

      // Get subscription details
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      setSubscription(sub)
      setIsChecking(false)
    }

    checkUser()
  }, [router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isExpiredTrial = subscription?.status === "trial" || subscription?.status === "expired"

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-light tracking-wider">
            ALMA
          </Link>
          <Button variant="ghost" onClick={() => router.push("/auth/logout")}>
            Cerrar sesión
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 lg:px-8 py-16 lg:py-24">
        {/* Hero */}
        <div className="text-center mb-16">
          {isExpiredTrial ? (
            <>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance mb-6">
                Tu trial ha finalizado
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                Esperamos que hayas disfrutado estos días.
                <br />
                Ahora puedes elegir cómo continuar.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance mb-6">
                Accede a todo el contenido
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                Elige el plan que mejor se adapte a ti
              </p>
            </>
          )}
        </div>

        {/* Pricing Options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Plan Mensual */}
          <div className="p-8 lg:p-10 border border-border/40 rounded-2xl hover:border-border transition-colors">
            <div className="mb-6">
              <h3 className="font-serif text-2xl mb-2">Plan Mensual</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-light">USD 15</span>
                <span className="text-muted-foreground">/mes</span>
              </div>
              <p className="text-sm text-muted-foreground line-through">Precio regular: USD 30</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
                <span>Acceso completo a todos los programas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
                <span>Nuevas clases cada semana</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
                <span>Cancela cuando quieras</span>
              </li>
            </ul>

            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => {
                // TODO: Implement checkout
                alert("Próximamente: Checkout con MercadoPago/PayPal")
              }}
            >
              Elegir plan mensual
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Plan Fundador - DESTACADO */}
          <div className="p-8 lg:p-10 bg-foreground text-background rounded-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground rounded-full text-sm">
              Oferta especial
            </div>

            <div className="mb-6">
              <h3 className="font-serif text-2xl mb-2">Acceso Fundador</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-light">USD 30</span>
                <span className="opacity-70">/3 meses</span>
              </div>
              <p className="text-sm opacity-70">Solo USD 10 por mes</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Todo del plan mensual</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Precio fundador respetado de por vida</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Acceso prioritario a nuevas funciones</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Oferta limitada de lanzamiento</span>
              </li>
            </ul>

            <Button
              size="lg"
              variant="secondary"
              className="w-full"
              onClick={() => router.push("/acceso-fundador")}
            >
              Unirme como fundador
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Garantía */}
        <div className="text-center p-6 bg-secondary/50 border border-border/30 rounded-xl">
          <p className="text-sm text-muted-foreground">
            💯 Garantía de satisfacción · Sin contratos · Cancela cuando quieras
          </p>
        </div>

        {/* Volver al inicio */}
        {!isExpiredTrial && (
          <div className="mt-8 text-center">
            <Link href="/" className="text-muted-foreground underline hover:no-underline">
              ← Volver al inicio
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
