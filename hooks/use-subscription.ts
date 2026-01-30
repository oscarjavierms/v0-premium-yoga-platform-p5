import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export type SubscriptionStatus = "active" | "trial" | "expired" | "none" | "loading"

export function useSubscription() {
  const [status, setStatus] = useState<SubscriptionStatus>("loading")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSubscription = async () => {
      const supabase = createClient()
      
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setStatus("none")
        setUser(null)
        return
      }

      setUser(user)

      // TODO: Replace with real subscription check when Stripe is integrated
      // For now, we'll check a flag in user metadata or a subscriptions table
      
      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single()

      if (subscriptionData) {
        setStatus("active")
      } else {
        // Check if trial is still valid
        // For now, all users without subscription have no access
        setStatus("none")
      }
    }

    checkSubscription()
  }, [])

  const requireSubscription = (redirectToPaywall = true) => {
    if (status === "none" && redirectToPaywall) {
      router.push("/acceso-fundador")
      return false
    }
    return status === "active"
  }

  return {
    status,
    user,
    hasActiveSubscription: status === "active",
    requireSubscription,
    isLoading: status === "loading",
  }
}

/**
 * Create a founder access subscription (3 months for $30)
 */
export async function createFounderSubscription(userId: string) {
  const supabase = createClient()

  // Calculate dates
  const now = new Date()
  const periodEnd = new Date()
  periodEnd.setMonth(periodEnd.getMonth() + 3) // 3 months

  const { data, error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    status: "active",
    plan_type: "founder",
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    price_paid: 30.0,
  }).select().single()

  if (error) {
    console.error("[v0] Error creating founder subscription:", error)
    throw error
  }

  console.log("[v0] Founder subscription created successfully:", data)
  return data
}
