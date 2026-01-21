"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      console.log("[v0] Login successful, user:", data.user?.id)

      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("id").eq("id", data.user.id).single()

        if (!profile) {
          console.log("[v0] Profile not found after login, creating...")
          const fullName =
            [data.user.user_metadata?.first_name, data.user.user_metadata?.last_name].filter(Boolean).join(" ") ||
            data.user.user_metadata?.full_name ||
            ""

          await supabase.from("profiles").insert({
            id: data.user.id,
            email: data.user.email,
            full_name: fullName,
            avatar_url: data.user.user_metadata?.avatar_url || "",
            role: "user",
          })
        }
      }

      window.location.href = redirect
    } catch (error: unknown) {
      console.error("[v0] Login error:", error)
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          setError("Email o contraseña incorrectos")
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
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 bg-secondary/50 border-border/50 focus:border-foreground focus:ring-foreground"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium">
            Contraseña
          </Label>
          <Link
            href="/auth/recuperar"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>

          <div className="mb-8">
            <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-2">Bienvenido de nuevo</h1>
            <p className="text-muted-foreground">Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          <Suspense
            fallback={
              <div className="space-y-6">
                <div className="h-12 bg-secondary/50 rounded animate-pulse" />
                <div className="h-12 bg-secondary/50 rounded animate-pulse" />
                <div className="h-12 bg-foreground rounded animate-pulse" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link href="/auth/registro" className="text-foreground hover:underline font-medium">
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 xl:w-[55%] relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/yoga-meditation-woman-serene-studio.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-lg font-serif italic text-foreground/80">
            "El yoga no se trata de tocarse los dedos de los pies, se trata de lo que aprendes en el camino hacia
            abajo."
          </blockquote>
          <p className="mt-2 text-sm text-muted-foreground">— Jigar Gor</p>
        </div>
      </div>
    </div>
  )
}
