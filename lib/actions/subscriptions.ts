import { createClient } from "@/lib/supabase/client"

/**
 * Create a trial subscription (7 days free)
 */
export async function createTrialSubscription(userId: string, email: string) {
  const supabase = createClient()

  // Calculate dates
  const now = new Date()
  const trialEnd = new Date()
  trialEnd.setDate(trialEnd.getDate() + 7) // 7 days trial

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      email: email,
      status: "trial",
      plan: "trial",
      trial_start_date: now.toISOString(),
      trial_end_date: trialEnd.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("[ERROR] Creating trial subscription:", error)
    throw new Error("No se pudo crear el trial. Por favor, intenta de nuevo.")
  }

  console.log("[SUCCESS] Trial subscription created:", data)
  return data
}

/**
 * Create a founder access subscription (3 months for $30)
 */
export async function createFounderSubscription(
  userId: string,
  email: string,
  transactionId?: string,
  paymentMethod?: string
) {
  const supabase = createClient()

  // Calculate dates
  const now = new Date()
  const periodEnd = new Date()
  periodEnd.setMonth(periodEnd.getMonth() + 3) // 3 months

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      email: email,
      status: "active",
      plan: "fundador",
      subscription_start_date: now.toISOString(),
      subscription_end_date: periodEnd.toISOString(),
      payment_method: paymentMethod || "manual",
      transaction_id: transactionId,
    })
    .select()
    .single()

  if (error) {
    console.error("[ERROR] Creating founder subscription:", error)
    throw new Error("No se pudo activar el acceso fundador. Por favor, intenta de nuevo.")
  }

  console.log("[SUCCESS] Founder subscription created:", data)
  return data
}

/**
 * Create a premium subscription ($15/month)
 */
export async function createPremiumSubscription(
  userId: string,
  email: string,
  transactionId?: string,
  paymentMethod?: string
) {
  const supabase = createClient()

  // Calculate dates
  const now = new Date()
  const periodEnd = new Date()
  periodEnd.setMonth(periodEnd.getMonth() + 1) // 1 month

  const { data, error } = await supabase
    .from("subscriptions")
    .insert({
      user_id: userId,
      email: email,
      status: "active",
      plan: "premium",
      subscription_start_date: now.toISOString(),
      subscription_end_date: periodEnd.toISOString(),
      payment_method: paymentMethod || "manual",
      transaction_id: transactionId,
    })
    .select()
    .single()

  if (error) {
    console.error("[ERROR] Creating premium subscription:", error)
    throw new Error("No se pudo activar la suscripción. Por favor, intenta de nuevo.")
  }

  console.log("[SUCCESS] Premium subscription created:", data)
  return data
}

/**
 * Check if user has active subscription
 */
export async function checkActiveSubscription(userId: string) {
  const supabase = createClient()

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .or("status.eq.active,status.eq.trial")
    .single()

  if (error) {
    console.log("[INFO] No active subscription found")
    return null
  }

  // Check if subscription is expired
  const now = new Date()
  if (subscription.status === "active" && subscription.subscription_end_date) {
    if (new Date(subscription.subscription_end_date) < now) {
      // Subscription expired, update status
      await supabase
        .from("subscriptions")
        .update({ status: "expired" })
        .eq("id", subscription.id)
      return null
    }
  }

  if (subscription.status === "trial" && subscription.trial_end_date) {
    if (new Date(subscription.trial_end_date) < now) {
      // Trial expired, update status
      await supabase
        .from("subscriptions")
        .update({ status: "expired" })
        .eq("id", subscription.id)
      return null
    }
  }

  return subscription
}

/**
 * Get subscription details for user
 */
export async function getSubscriptionDetails(userId: string) {
  const supabase = createClient()

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return subscription
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("subscriptions")
    .update({ 
      status: "cancelled",
      cancelled_at: new Date().toISOString()
    })
    .eq("user_id", userId)
    .eq("status", "active")
    .select()
    .single()

  if (error) {
    console.error("[ERROR] Canceling subscription:", error)
    throw new Error("No se pudo cancelar la suscripción.")
  }

  return data
}
