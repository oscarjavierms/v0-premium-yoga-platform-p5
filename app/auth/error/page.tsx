import { Button } from "@/components/ui/button"
import { AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  const errorMessages: Record<string, string> = {
    access_denied: "El acceso fue denegado",
    invalid_request: "La solicitud no es válida",
    unauthorized_client: "Cliente no autorizado",
    server_error: "Error del servidor",
    temporarily_unavailable: "Servicio temporalmente no disponible",
  }

  const errorMessage =
    params.error && errorMessages[params.error]
      ? errorMessages[params.error]
      : "Ocurrió un error durante la autenticación"

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="font-serif text-3xl lg:text-4xl font-light tracking-tight mb-4">Algo salió mal</h1>

        <p className="text-muted-foreground mb-2">{errorMessage}</p>

        {params.error && <p className="text-sm text-muted-foreground/60 mb-8">Código de error: {params.error}</p>}

        <div className="flex flex-col gap-3">
          <Link href="/auth/login">
            <Button className="w-full h-12 bg-foreground text-background hover:bg-foreground/90">
              Intentar de nuevo
            </Button>
          </Link>

          <Link href="/">
            <Button variant="ghost" className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
