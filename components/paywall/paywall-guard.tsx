"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface PaywallGuardProps {
  children: React.ReactNode
  redirectTo?: string
}

export function PaywallGuard({ children, redirectTo = "/acceso-fundador" }: PaywallGuardProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      const supabase = createClient()

      // Check if user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        console.log("[v0] No session, redirecting to login")
        router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname))
        return
      }

      // Check if user has active subscription
      const { data: subscription, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .single()

      if (error && error.code !== "PGRST116") {
        // PGRST116 = no rows returned, which is fine
        console.error("[v0] Error checking subscription:", error)
      }

      if (!subscription) {
        console.log("[v0] No active subscription, redirecting to paywall")
        router.push(redirectTo)
        return
      }

      // Check if subscription is still valid (not expired)
      const currentPeriodEnd = new Date(subscription.current_period_end)
      if (currentPeriodEnd < new Date()) {
        console.log("[v0] Subscription expired, redirecting to paywall")
        router.push(redirectTo)
        return
      }

      console.log("[v0] User has active subscription, allowing access")
      setHasAccess(true)
      setIsChecking(false)
    }

    checkAccess()
  }, [router, redirectTo])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!hasAccess) {
    return null // Will redirect
  }

  return <>{children}</>
}
