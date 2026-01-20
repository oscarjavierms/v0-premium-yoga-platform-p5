"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Check } from "lucide-react"

export default function RegistroPage() {
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
  const router = useRouter()

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
      // Supabase needs to process the token at callback first, then callback redirects to onboarding
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
            full_name: fullName, // Added full_name for trigger compatibility
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
