import { Button } from "@/components/ui/button"
import { Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function RegistroExitosoPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-8">
          <Mail className="h-10 w-10 text-foreground" />
        </div>

        <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-4">¡Revisa tu correo!</h1>

        <p className="text-muted-foreground mb-8 leading-relaxed">
          Te hemos enviado un enlace de confirmación a tu correo electrónico. Por favor, haz clic en el enlace para
          activar tu cuenta y comenzar tu viaje de bienestar.
        </p>

        <div className="bg-secondary/50 rounded-xl p-6 mb-8">
          <h3 className="font-medium mb-2">¿No recibiste el correo?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Revisa tu carpeta de spam o solicita un nuevo enlace de confirmación.
          </p>
          <Button variant="outline" className="w-full bg-transparent">
            Reenviar correo de confirmación
          </Button>
        </div>

        <Link href="/">
          <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
            Volver al inicio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
