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
      const supabase = createClient()

      // 1. Obtener sesión del usuario
      const {
        data: { session },
      } = await supabase.auth.getSession()

      // Si no hay sesión, redirige a login
      if (!session) {
        console.log("[PaywallGuard] No hay sesión, redirigiendo a login")
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`)
        return
      }

      // 2. Verificar si es admin
      const { data: userMetadata } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()

      if (userMetadata?.role === "admin") {
        console.log("[PaywallGuard] Usuario es admin, permitiendo acceso")
        setHasAccess(true)
        setIsChecking(false)
        return
      }

      // 3. Verificar subscription activa
      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      // Si no hay subscription, redirige a paywall
      if (!subscription) {
        console.log("[PaywallGuard] Sin suscripción, redirigiendo a paywall")
        router.push("/paywall")
        return
      }

      // 4. Verificar si es trial activo
      if (subscription.plan === "trial") {
        const trialEnd = new Date(subscription.trial_end_date)
        const now = new Date()

        if (trialEnd > now) {
          console.log("[PaywallGuard] Trial activo, permitiendo acceso")
          setHasAccess(true)
          setIsChecking(false)
          return
        } else {
          console.log("[PaywallGuard] Trial expirado, redirigiendo a paywall")
          router.push("/paywall")
          return
        }
      }

      // 5. Verificar si subscription está activa y válida
      if (subscription.status === "active") {
        const subEnd = new Date(subscription.subscription_end_date)
        const now = new Date()

        if (subEnd > now) {
          console.log("[PaywallGuard] Suscripción activa, permitiendo acceso")
          setHasAccess(true)
          setIsChecking(false)
          return
        }
      }

      // Si llegó aquí, no tiene acceso
      console.log("[PaywallGuard] Sin acceso válido, redirigiendo a paywall")
      router.push("/paywall")
    }

    checkAccess()
  }, [router, pathname])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!hasAccess) {
    return null // Está redirigiendo
  }

  return <>{children}</>
}
