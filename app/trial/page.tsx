"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function TrialPage() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      // If user is logged in, check if they already have subscription/trial
      if (user) {
        const { data: subscription } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .single()

        if (subscription) {
          // Already has subscription or trial
          if (subscription.status === "trial") {
            router.push("/trial/activo")
          } else if (subscription.status === "active") {
            router.push("/mi-santuario")
          }
          return
        }
      }

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 lg:px-8 py-16 lg:py-24">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-secondary rounded-full">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Prueba 7 días gratis</span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight text-balance mb-6">
            Empieza tu práctica sin compromiso
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            7 días completos para explorar la plataforma.<br />
            Sin tarjeta. Sin presión.
          </p>

          <Link href="/auth/registro?trial=true">
            <Button size="lg" className="px-8 py-6 text-sm tracking-wider rounded-full">
              Comenzar mi trial de 7 días
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Qué incluye */}
        <div className="mb-16">
          <h2 className="text-2xl font-serif mb-8 text-center">Qué incluye el trial</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Acceso completo a todas las clases",
              "Prácticas guiadas de yoga y meditación",
              "Entrenamiento funcional consciente",
              "Acceso desde cualquier dispositivo",
              "Sin límite de uso durante 7 días",
              "Cancela cuando quieras",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Después del trial */}
        <div className="bg-secondary/50 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-medium mb-3">Después de los 7 días</h3>
          <p className="text-muted-foreground mb-4">
            Si decides continuar, podrás elegir entre el acceso fundador o las opciones regulares.
          </p>
          <p className="text-sm text-muted-foreground">
            No se cobra nada automáticamente. Tú decides si quieres seguir.
          </p>
        </div>
      </main>
    </div>
  )
}
