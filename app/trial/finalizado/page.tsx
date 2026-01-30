"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Check, ArrowRight, Sparkles, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function TrialFinalizadoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Check if user has active subscription
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single()

      if (sub) {
        // User already has active subscription
        router.push("/mi-santuario")
        return
      }

      setIsLoading(false)
    }

    checkUser()
  }, [router])

  if (isLoading) {
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
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-balance mb-6">
            Tu trial ha finalizado
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Esperamos que hayas disfrutado de estos 7 días de prácticas.<br />
            Continúa tu camino con el acceso fundador.
          </p>
        </div>

        {/* Oferta Fundador */}
        <div className="bg-foreground text-background rounded-3xl p-8 lg:p-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-background/10 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Oferta exclusiva</span>
            </div>

            <h2 className="font-serif text-3xl md:text-4xl mb-4">Acceso fundador</h2>
            <p className="text-background/80 mb-6">
              3 meses completos de acceso a toda la plataforma
            </p>

            <div className="text-5xl font-light mb-8">USD 30</div>

            <Link href="/acceso-fundador">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 px-8 py-6 text-sm tracking-wider rounded-full">
                Continuar con acceso fundador
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Lo que incluye */}
        <div className="mb-12">
          <h3 className="text-xl font-medium mb-6 text-center">Lo que incluye</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Acceso completo a todas las clases",
              "Yoga, meditación y fitness consciente",
              "Prácticas guiadas sin límite",
              "Acceso desde cualquier dispositivo",
              "3 meses completos",
              "Cancela cuando quieras",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-foreground flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alternative */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            ¿Prefieres no continuar ahora?
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground underline">
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  )
}
