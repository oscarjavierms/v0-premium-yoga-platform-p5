"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface PaywallGuardProps {
  children: React.ReactNode
}

export function PaywallGuard({ children }: PaywallGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const supabase = createClient()

        // 1. Obtener sesión
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          console.log("[PaywallGuard] Sin sesión")
          router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
          return
        }

        // 2. Obtener perfil
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .maybeSingle()

        // Si es admin, permitir acceso
        if (profile?.role === "admin") {
          console.log("[PaywallGuard] Admin detectado")
          setHasAccess(true)
          setIsChecking(false)
          return
        }

        // 3. Verificar suscripción
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        // Si no hay suscripción, bloquear
        if (!subscription) {
          console.log("[PaywallGuard] Sin suscripción")
          router.push("/paywall")
          return
        }

        // 4. Verificar trial activo
        if (subscription.plan === "trial" && subscription.trial_end_date) {
          const trialEnd = new Date(subscription.trial_end_date)
          if (trialEnd > new Date()) {
            console.log("[PaywallGuard] Trial activo")
            setHasAccess(true)
            setIsChecking(false)
            return
          }
        }

        // 5. Verificar suscripción activa
        if (subscription.status === "active" && subscription.subscription_end_date) {
          const subEnd = new Date(subscription.subscription_end_date)
          if (subEnd > new Date()) {
            console.log("[PaywallGuard] Suscripción activa")
            setHasAccess(true)
            setIsChecking(false)
            return
          }
        }

        // Sin acceso válido
        console.log("[PaywallGuard] Sin acceso válido")
        router.push("/paywall")

      } catch (error) {
        console.error("[PaywallGuard] Error:", error)
        router.push("/paywall")
      }
    }

    checkAccess()
  }, [router, pathname])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!hasAccess) {
    return null
  }

  return <>{children}</>
}
