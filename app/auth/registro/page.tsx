"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react"

export default function RegistroPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if user already has active session
  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        console.log("[v0] User already has active session, redirecting to dashboard")
        router.push("/mi-santuario")
      }
    }

    checkSession()
  }, [router])

  const passwordRequirements = [
    { label: "Mínimo 8 caracteres", met: formData.password.length >= 8 },
    { label: "Una letra mayúscula", met: /[A-Z]/.test(formData.password) },
    { label: "Una letra minúscula", met: /[a-z]/.test(formData.password) },
    { label: "Un número", met: /\d/.test(formData.password) },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.met)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!isPasswordValid) {
      setError("La contraseña no cumple con los requisitos")
      return
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    const supabase = createClient()
    setIsLoading(true)

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`.trim()

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      console.log("[v0] Signup successful, user:", data.user?.id)
      router.push("/auth/registro-exitoso")
    } catch (error: unknown) {
      console.error("[v0] Signup error:", error)
      if (error instanceof Error) {
        if (error.message.includes("already registered")) {
          setError("Este email ya está registrado")
        } else {
          setError(error.message)
        }
      } else {
        setError("Ocurrió un error inesperado")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: "google" | "facebook") => {
    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback?next=/mi-santuario`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      console.error(`[v0] ${provider} signup error:`, error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("Ocurrió un error inesperado")
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 xl:w-[45%] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/peaceful-yoga-stretch-woman-natural-light-studio.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/50 to-transparent" />
        </div>
        <div className="absolute top-12 left-12">
          <Link href="/" className="font-serif text-2xl font-light tracking-wider">
            ALMA
          </Link>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24 py-12">
        <div className="w-full max-w-md mx-auto">
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mb-8">
            <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-2">Comienza tu viaje</h1>
            <p className="text-muted-foreground">Crea tu cuenta y transforma tu bienestar</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                  Nombre
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="María"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="h-12 bg-secondary/50 border-border/50 focus:border-foreground focus:ring-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                  Apellido
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="García"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="h-12 bg-secondary/50 border-border/50 focus:border-foreground focus:ring-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 bg-secondary/50 border-border/50 focus:border-foreground focus:ring-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-12 bg-secondary/50 border-border/50 focus:border-foreground focus:ring-foreground pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-xs ${
                        req.met ? "text-green-600" : "text-muted-foreground"
                      }`}
                    >
                      <Check className={`h-3 w-3 ${req.met ? "opacity-100" : "opacity-30"}`} />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar contraseña
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-12 bg-secondary/50 border-border/50 focus:border-foreground focus:ring-foreground"
              />
            </div>

            <div className="flex items-start gap-3 py-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                Acepto los{" "}
                <Link href="/terminos" className="text-foreground hover:underline">
                  términos y condiciones
                </Link>{" "}
                y la{" "}
                <Link href="/privacidad" className="text-foreground hover:underline">
                  política de privacidad
                </Link>
              </Label>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium"
              disabled={isLoading || !acceptTerms}
            >
              {isLoading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">O continuar con</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignUp("google")}
              disabled={isLoading || !acceptTerms}
              className="h-12 border-border/50 hover:bg-secondary/50"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignUp("facebook")}
              disabled={isLoading || !acceptTerms}
              className="h-12 border-border/50 hover:bg-secondary/50"
            >
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="text-foreground hover:underline font-medium">
              Ingresar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
