"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

export function ResendVerificationButton({ email }: { email: string }) {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleResend = async () => {
    setIsResending(true)
    setMessage(null)
    
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      
      if (error) throw error
      
      setMessage("Email de verificación enviado. Revisa tu bandeja de entrada.")
    } catch (error) {
      console.error("[v0] Resend error:", error)
      setMessage("Error al enviar el email. Intenta de nuevo.")
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div>
      <Button 
        size="sm" 
        variant="outline" 
        className="bg-white border-red-300 text-red-700 hover:bg-red-50"
        onClick={handleResend}
        disabled={isResending}
      >
        {isResending ? "Enviando..." : "Reenviar email de verificación"}
      </Button>
      {message && (
        <p className="text-xs mt-2 text-red-700">{message}</p>
      )}
    </div>
  )
}
