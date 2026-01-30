"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ArrowRight, AlertCircle, Loader2, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { createFounderSubscription } from "@/lib/actions/subscriptions"

export default function FundadoresPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<"landing" | "register" | "checkout">("landing")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"mercadopago" | "paypal" | null>(null)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)
        
        // Check if user already has subscription
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .or("status.eq.active,status.eq.trial")
          .single()

        const now = new Date()
        const isValidSubscription = subscription && (
          (subscription.status === "active" && 
           subscription.subscription_end_date && 
           new Date(subscription.subscription_end_date) > now) ||
          (subscription.status === "trial" && 
           subscription.trial_end_date && 
           new Date(subscription.trial_end_date) > now)
        )

        if (isValidSubscription) {
          router.push("/mi-santuario")
          return
        }

        // User logged in but no subscription - go to checkout
        setStep("checkout")
      }

      setIsChecking(false)
    }

    checkUser()
  }, [router])

  const handleStartJourney = () => {
    if (user) {
      setStep("checkout")
    } else {
      setStep("register")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (formData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }

      const supabase = createClient()

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error("No se pudo crear la cuenta")

      setUser(authData.user)
      setStep("checkout")
      setIsLoading(false)
    } catch (err: any) {
      console.error("[ERROR]", err)
      setError(err.message || "Error al crear la cuenta")
      setIsLoading(false)
    }
  }

  const handlePaymentMethod = (method: "mercadopago" | "paypal") => {
    setPaymentMethod(method)
  }

  const handleCheckout = async () => {
    if (!paymentMethod) {
      setError("Por favor selecciona un método de pago")
      return
    }

    if (!user) {
      setError("Debes iniciar sesión primero")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      if (paymentMethod === "mercadopago") {
        // TODO: Integración real con MercadoPago
        // Por ahora, simulamos el pago
        await simulatePayment()
      } else if (paymentMethod === "paypal") {
        // TODO: Integración real con PayPal
        // Por ahora, simulamos el pago
        await simulatePayment()
      }
    } catch (err: any) {
      console.error("[ERROR]", err)
      setError(err.message || "Error al procesar el pago")
      setIsLoading(false)
    }
  }

  const simulatePayment = async () => {
    // Simular delay de pago
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Crear subscripción de fundador
    await createFounderSubscription(
      user.id,
      user.email!,
      `DEMO-${Date.now()}`, // Transaction ID simulado
      paymentMethod!
    )

    // Redirigir a dashboard
    router.push("/mi-santuario?welcome=true")
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

        {/* LANDING */}
        {step === "landing" && (
          <>
            {/* Hero */}
            <div className="text-center mb-16">
              <div className="inline-block px-4 py-1 bg-foreground text-background rounded-full text-sm mb-6">
                Oferta de lanzamiento
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance mb-6">
                Acceso fundador
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                Sé parte del inicio. Accede a la plataforma completa con precio especial de lanzamiento.
              </p>
              <div className="mb-8">
                <p className="text-5xl md:text-6xl font-light mb-2">USD 30</p>
                <p className="text-lg text-muted-foreground mb-1">por 3 meses completos</p>
                <p className="text-sm text-muted-foreground">Solo USD 10 por mes</p>
              </div>
              <Button
                size="lg"
                className="px-8 py-6 text-sm tracking-wider rounded-full"
                onClick={handleStartJourney}
              >
                Unirme como fundador
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Beneficios */}
            <div className="mb-16 p-8 lg:p-12 bg-secondary/50 border border-border/30 rounded-2xl">
              <h2 className="font-serif text-2xl md:text-3xl mb-6">Como fundador obtienes:</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">Acceso completo a todos los programas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">21 clases de yoga, meditación y fitness</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">Nuevas clases cada semana</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">Precio fundador de por vida (si continúas)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">Acceso prioritario a nuevas funciones</span>
                </li>
              </ul>
            </div>

            {/* Por qué ahora */}
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl md:text-3xl mb-6">Por qué ahora</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>Esta es la oferta de lanzamiento.</p>
                <p>El precio fundador está disponible por tiempo limitado.</p>
                <p>Cuando la plataforma crezca, el precio cambiará.</p>
                <p>Si esto resuena contigo, este es el momento.</p>
              </div>
            </div>

            {/* Para quién */}
            <div className="mb-16 p-8 lg:p-12 bg-foreground text-background rounded-2xl">
              <h2 className="font-serif text-2xl md:text-3xl mb-6">Este acceso es para ti si:</h2>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 mt-1" />
                  <span>Valoras tu bienestar físico y mental</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 mt-1" />
                  <span>Buscas estructura y claridad en tu práctica</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 mt-1" />
                  <span>Prefieres calidad sobre cantidad</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 flex-shrink-0 mt-1" />
                  <span>Quieres ser parte de una comunidad desde el inicio</span>
                </li>
              </ul>
            </div>

            {/* CTA Final */}
            <div className="text-center">
              <Button
                size="lg"
                className="px-8 py-6 text-sm tracking-wider rounded-full mb-4"
                onClick={handleStartJourney}
              >
                Comenzar ahora · USD 30 / 3 meses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="text-sm text-muted-foreground">
                Sin contratos · Acceso inmediato · Cancela cuando quieras
              </p>
            </div>
          </>
        )}

        {/* REGISTER FORM */}
        {step === "register" && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl mb-2">Crea tu cuenta</h2>
              <p className="text-muted-foreground">Para acceder al checkout</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Tu nombre"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repite tu contraseña"
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    Continuar al pago
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/auth/login" className="underline hover:no-underline">
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>
        )}

        {/* CHECKOUT */}
        {step === "checkout" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl mb-2">Completa tu acceso fundador</h2>
              <p className="text-muted-foreground">Elige tu método de pago preferido</p>
            </div>

            {/* Resumen */}
            <div className="mb-8 p-6 bg-secondary/50 border border-border/30 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">Acceso Fundador - 3 meses</span>
                <span className="text-2xl font-light">USD 30</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Incluye acceso completo a todos los programas y clases
              </p>
            </div>

            {/* Métodos de pago */}
            <div className="space-y-4 mb-8">
              <p className="text-sm font-medium mb-4">Selecciona método de pago:</p>
              
              {/* MercadoPago */}
              <button
                onClick={() => handlePaymentMethod("mercadopago")}
                className={`w-full p-6 border-2 rounded-xl text-left transition-all ${
                  paymentMethod === "mercadopago"
                    ? "border-foreground bg-secondary/50"
                    : "border-border/40 hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">MercadoPago</p>
                      <p className="text-sm text-muted-foreground">Tarjeta de crédito/débito</p>
                    </div>
                  </div>
                  {paymentMethod === "mercadopago" && (
                    <Check className="h-5 w-5 text-foreground" />
                  )}
                </div>
              </button>

              {/* PayPal */}
              <button
                onClick={() => handlePaymentMethod("paypal")}
                className={`w-full p-6 border-2 rounded-xl text-left transition-all ${
                  paymentMethod === "paypal"
                    ? "border-foreground bg-secondary/50"
                    : "border-border/40 hover:border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-muted-foreground">Pago seguro con PayPal</p>
                    </div>
                  </div>
                  {paymentMethod === "paypal" && (
                    <Check className="h-5 w-5 text-foreground" />
                  )}
                </div>
              </button>
            </div>

            {/* Botón de pago */}
            <Button
              size="lg"
              className="w-full mb-4"
              onClick={handleCheckout}
              disabled={!paymentMethod || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando pago...
                </>
              ) : (
                <>
                  Pagar USD 30
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>

            {/* Nota temporal */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Nota temporal:</strong> El checkout está en modo demostración. Cuando agregues tus credenciales de MercadoPago/PayPal, se procesarán pagos reales.
              </p>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              🔒 Pago seguro · Tus datos están protegidos
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
