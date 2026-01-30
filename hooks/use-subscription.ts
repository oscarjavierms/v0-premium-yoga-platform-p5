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

      // Check for admin role - admins always have access
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single()

      if (profile?.role === "admin") {
        setStatus("active") // Admins treated as active
        return
      }

      // Check for active subscription or trial
      const { data: subscriptionData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["active", "trial"])
        .single()

      if (subscriptionData) {
        // Check if not expired
        const currentPeriodEnd = new Date(subscriptionData.current_period_end)
        if (currentPeriodEnd < new Date()) {
          setStatus("expired")
        } else {
          setStatus(subscriptionData.status as SubscriptionStatus)
        }
      } else {
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
 * Create a trial subscription (7 days free)
 */
export async function createTrialSubscription(userId: string) {
  const supabase = createClient()

  // Check if user already has a subscription or trial
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (existing) {
    throw new Error("User already has a subscription")
  }

  // Calculate dates
  const now = new Date()
  const periodEnd = new Date()
  periodEnd.setDate(periodEnd.getDate() + 7) // 7 days

  const { data, error } = await supabase.from("subscriptions").insert({
    user_id: userId,
    status: "trial",
    plan_type: "trial",
    current_period_start: now.toISOString(),
    current_period_end: periodEnd.toISOString(),
    price_paid: 0,
  }).select().single()

  if (error) {
    console.error("[v0] Error creating trial subscription:", error)
    throw error
  }

  console.log("[v0] Trial subscription created successfully:", data)
  return data
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
