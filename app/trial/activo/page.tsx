"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function TrialActivoPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [daysRemaining, setDaysRemaining] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    const checkTrial = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "trial")
        .single()

      if (!sub) {
        // No trial found, redirect
        router.push("/trial")
        return
      }

      const endDate = new Date(sub.current_period_end)
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

      if (days <= 0) {
        // Trial expired
        router.push("/trial/finalizado")
        return
      }

      setDaysRemaining(days)
      setSubscription(sub)
      setIsLoading(false)
    }

    checkTrial()
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
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/mi-santuario" className="text-sm text-muted-foreground hover:text-foreground">
            Ir al santuario
          </Link>
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 rounded-full">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {daysRemaining} {daysRemaining === 1 ? "día" : "días"} restantes
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-balance mb-6">
            Tu trial está activo
          </h1>
          
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Tienes <strong>{daysRemaining} {daysRemaining === 1 ? "día" : "días"}</strong> para explorar todo el contenido de la plataforma.
          </p>

          <Link href="/mi-santuario">
            <Button size="lg" className="px-8 py-6 text-sm tracking-wider rounded-full">
              Explorar el santuario
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Info about trial */}
        <div className="space-y-8">
          <div className="bg-secondary/50 rounded-2xl p-8">
            <h3 className="text-xl font-medium mb-3">¿Qué puedes hacer durante el trial?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Acceso completo a todas las clases de yoga, meditación y fitness</li>
              <li>• Prácticas guiadas sin límite</li>
              <li>• Acceso desde cualquier dispositivo</li>
            </ul>
          </div>

          <div className="bg-secondary/50 rounded-2xl p-8">
            <h3 className="text-xl font-medium mb-3">¿Qué pasa después del trial?</h3>
            <p className="text-muted-foreground mb-4">
              Cuando termine tu período de prueba, podrás elegir continuar con el acceso fundador (3 meses por USD 30) o explorar otras opciones.
            </p>
            <p className="text-sm text-muted-foreground">
              No se cobra nada automáticamente. Tú decides si quieres continuar.
            </p>
          </div>

          <div className="text-center">
            <Link href="/acceso-fundador">
              <Button variant="outline" size="lg" className="rounded-full">
                Ver oferta de acceso fundador
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
