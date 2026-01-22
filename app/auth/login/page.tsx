"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, Suspense } from "react"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (loginError) throw loginError

      // Si el login fue exitoso, saltamos directo al santuario
      // Ignoramos la verificación de perfil aquí para evitar bloqueos
      if (data?.user) {
        window.location.href = "/mi-santuario"
        return // Detenemos cualquier otra ejecución
      }
      
    } catch (error: any) {
      setError(error.message || "Error al ingresar")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="tu@email.com" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pr-12" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</p>}
      <Button type="submit" className="w-full h-12 bg-black text-white hover:bg-black/90" disabled={isLoading}>
        {isLoading ? "Ingresando..." : "Ingresar"}
      </Button>
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
