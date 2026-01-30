"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { createFounderSubscription } from "@/hooks/use-subscription"

export default function AccesoFundadorPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/registro")
        return
      }

      setUser(user)

      // Check if user has active subscription
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single()

      if (subscription) {
        router.push("/mi-santuario")
        return
      }

      setIsChecking(false)
    }

    checkUser()
  }, [router])

  const handleActivateAccess = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login?redirect=/acceso-fundador")
        return
      }

      // Check if user email is verified
      if (!user.email_confirmed_at) {
        setError("Por favor verifica tu email antes de continuar. Revisa tu bandeja de entrada.")
        setIsLoading(false)
        return
      }

      // Create founder subscription
      await createFounderSubscription(user.id)

      // Redirect to dashboard
      console.log("[v0] Founder access activated, redirecting to dashboard")
      router.push("/mi-santuario")
    } catch (err: any) {
      console.error("[v0] Error activating founder access:", err)
      setError(err.message || "Error al activar el acceso. Por favor, intenta de nuevo.")
      setIsLoading(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
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
        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

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
          <Button 
            size="lg" 
            className="px-8 py-6 text-sm tracking-wider rounded-full"
            onClick={handleActivateAccess}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activando acceso...
              </>
            ) : (
              <>
                Unirme como fundador
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            {user?.email_confirmed_at ? "✓ Email verificado" : "⚠️ Necesitas verificar tu email primero"}
          </p>
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
          <Button 
            size="lg" 
            className="px-8 py-6 text-sm tracking-wider rounded-full mb-4"
            onClick={handleActivateAccess}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Activando...
              </>
            ) : (
              <>
                Acceder ahora · USD 30 / 3 meses
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Sin contratos largos · Acceso inmediato · Cancela cuando quieras
          </p>
        </div>
      </main>
    </div>
  )
}
