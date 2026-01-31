"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, Suspense, useEffect } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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
        console.log("[Login] Usuario ya tiene sesión activa")
        router.push("/mi-santuario")
      }
    }

    checkSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Validar que no estén vacíos
      if (!email || !password) {
        setError("Email y contraseña son requeridos")
        setIsLoading(false)
        return
      }

      console.log("[Login] Intentando login con:", email)

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      console.log("[Login] Respuesta de Supabase:", { data, loginError })

      if (loginError) {
        console.error("[Login] Error de Supabase:", loginError)
        setError(loginError.message || "Credenciales inválidas")
        setIsLoading(false)
        return
      }

      if (!data?.user) {
        setError("No se pudo iniciar sesión. Intenta de nuevo.")
        setIsLoading(false)
        return
      }

      console.log("[Login] Login exitoso, redirigiendo a /mi-santuario")
      // Usar router.push en lugar de window.location.href para mejor compatibilidad
      router.push("/mi-santuario")
      
    } catch (error: any) {
      console.error("[Login] Error general:", error)
      setError(error?.message || "Error al ingresar. Intenta de nuevo.")
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "facebook") => {
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
    } catch (error: any) {
      console.error(`[Login] Error OAuth ${provider}:`, error)
      setError(error?.message || `Error al ingresar con ${provider}`)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="tu@email.com" 
          required 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="h-12"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input 
            id="password" 
            type={showPassword ? "text" : "password"} 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="h-12 pr-12"
            disabled={isLoading}
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="absolute right-4 top-1/2 -translate-y-1/2"
            disabled={isLoading}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}
      <Button 
        type="submit" 
        className="w-full h-12 bg-black text-white hover:bg-black/90" 
        disabled={isLoading}
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </Button>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">O continuar con</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleOAuthLogin("google")}
          disabled={isLoading}
          className="h-12"
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
          onClick={() => handleOAuthLogin("facebook")}
          disabled={isLoading}
          className="h-12"
        >
          <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Facebook
        </Button>
      </div>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-24">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm mb-12 hover:text-black/60 transition-colors">
            <ArrowLeft size={16} /> Volver al inicio
          </Link>
          <h1 className="font-serif text-[42px] leading-tight mb-2 text-black">Bienvenido de nuevo</h1>
          <p className="text-black/40 mb-8 font-light italic text-lg">Ingresa tus credenciales para acceder a tu santuario.</p>
          <Suspense fallback={<div className="h-40 bg-gray-50 animate-pulse rounded-xl" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
      <div className="hidden lg:block lg:w-1/2 bg-gray-50 relative">
        <div className="absolute inset-0 bg-[url('/yoga-meditation-woman-serene-studio.jpg')] bg-cover bg-center grayscale-[50%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent" />
      </div>
    </div>
  )
}
