"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, ArrowRight, AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function TrialPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const handleStartTrial = () => {
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Las contraseñas no coinciden")
      }

      if (formData.password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres")
      }

      const supabase = createClient()

      // Create user
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

      // Create trial subscription
      const now = new Date()
      const trialEnd = new Date()
      trialEnd.setDate(trialEnd.getDate() + 7)

      const { error: subError } = await supabase.from("subscriptions").insert({
        user_id: authData.user.id,
        email: formData.email,
        status: "trial",
        plan: "trial",
        trial_start_date: now.toISOString(),
        trial_end_date: trialEnd.toISOString(),
      })

      if (subError) throw subError

      // Redirect to dashboard
      router.push("/mi-santuario")
    } catch (err: any) {
      console.error("[ERROR]", err)
      setError(err.message || "Error al crear la cuenta. Por favor, intenta de nuevo.")
      setIsLoading(false)
    }
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

        {!showForm ? (
          <>
            {/* Hero - Oferta Trial */}
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance mb-6">
                Prueba 7 días gratis
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                Accede a toda la plataforma sin compromiso.
                <br />
                Sin tarjeta de crédito.
              </p>
              <div className="mb-8">
                <p className="text-3xl md:text-4xl font-light mb-2">
                  7 días <span className="text-muted-foreground">GRATIS</span>
                </p>
                <p className="text-muted-foreground">
                  Después: <span className="line-through">USD 30</span> USD 15/mes
                </p>
              </div>
              <Button
                size="lg"
                className="px-8 py-6 text-sm tracking-wider rounded-full"
                onClick={handleStartTrial}
              >
                Comenzar trial gratuito
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Qué incluye el trial */}
            <div className="mb-16 p-8 lg:p-12 bg-secondary/50 border border-border/30 rounded-2xl">
              <h2 className="font-serif text-2xl md:text-3xl mb-6">Durante tu trial tendrás:</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">Acceso completo a todos los programas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">21 clases guiadas de yoga, meditación y fitness</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">Nuevas clases cada semana</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-1" />
                  <span className="text-lg">Cancela cuando quieras, sin cargos</span>
                </li>
              </ul>
            </div>

            {/* Cómo funciona */}
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl md:text-3xl mb-6">Cómo funciona</h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>1. Creas tu cuenta (solo email y contraseña)</p>
                <p>2. Accedes inmediatamente a todo el contenido</p>
                <p>3. Al final de los 7 días, decides si continuar</p>
                <p className="text-sm mt-8">
                  No pedimos tarjeta de crédito.
                  <br />
                  Si decides continuar, eliges tu plan después del trial.
                </p>
              </div>
            </div>

            {/* Ya tienes cuenta */}
            <div className="text-center">
              <p className="text-muted-foreground mb-2">¿Ya tienes una cuenta?</p>
              <Link href="/auth/login" className="text-foreground underline hover:no-underline">
                Inicia sesión aquí
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Formulario de registro */}
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl mb-2">Crea tu cuenta</h2>
                <p className="text-muted-foreground">Para comenzar tu trial de 7 días gratis</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      Comenzar trial gratis
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-center text-muted-foreground">
                  Al crear tu cuenta aceptas nuestros términos y condiciones
                </p>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowForm(false)}
                  className="text-muted-foreground underline hover:no-underline"
                >
                  ← Volver
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
