import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // RUTAS PROTEGIDAS: Cambiamos dashboard por mi-santuario
  const PROTECTED_ROUTES = ["/mi-cuenta", "/mi-santuario", "/ver", "/favoritos", "/suscripcion", "/admin"]

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // REDIRECCIÓN DE ADMIN: Si no es admin, va a mi-santuario
  if (user && request.nextUrl.pathname.startsWith("/admin")) {
    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

      if (!profile || profile.role !== "admin") {
        const url = request.nextUrl.clone()
        url.pathname = "/mi-santuario"
        return NextResponse.redirect(url)
      }
    } catch {
      const url = request.nextUrl.clone()
      url.pathname = "/mi-santuario"
      return NextResponse.redirect(url)
    }
  }

  // REDIRECCIÓN DE USUARIOS LOGUEADOS: Si ya están dentro, van a mi-santuario
  const AUTH_ROUTES = ["/auth/login", "/auth/registro"]
  const isAuthRoute = AUTH_ROUTES.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = "/mi-santuario"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
