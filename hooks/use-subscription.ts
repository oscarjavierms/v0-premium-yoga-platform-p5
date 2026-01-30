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
