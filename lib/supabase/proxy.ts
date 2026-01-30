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

  const path = request.nextUrl.pathname

  // Rutas públicas - siempre accesibles
  const PUBLIC_ROUTES = [
    '/',
    '/auth/login',
    '/auth/registro',
    '/auth/callback',
    '/auth/error',
    '/auth/logout',
    '/auth/registro-exitoso',
  ]

  // Rutas de autenticación - redirigir a dashboard si ya está logueado
  const AUTH_ROUTES = ['/auth/login', '/auth/registro']

  // Rutas que requieren autenticación pero NO subscripción
  const AUTH_ONLY_ROUTES = [
    '/acceso-fundador',
    '/trial',
    '/paywall',
    '/suscripcion',
  ]

  // Rutas protegidas - requieren subscripción activa
  const PROTECTED_ROUTES = [
    '/mi-santuario',
    '/mi-cuenta',
    '/clases',
    '/programas',
    '/perfil',
    '/ajustes',
    '/mi-practica',
    '/historial',
    '/membresia',
    '/explorar',
    '/yoga',
    '/meditacion',
    '/fitness',
    '/instructores',
    '/instructor',
    '/clase',
    '/ver',
    '/favoritos',
  ]

  // Rutas de admin
  const ADMIN_ROUTES = ['/admin']

  // Permitir rutas públicas
  if (PUBLIC_ROUTES.some(route => path === route || path.startsWith('/api/'))) {
    return supabaseResponse
  }

  // Redirigir usuarios logueados que intentan acceder a páginas de auth
  if (user && AUTH_ROUTES.some(route => path.startsWith(route))) {
    const url = request.nextUrl.clone()
    url.pathname = '/mi-santuario'
    return NextResponse.redirect(url)
  }

  // Verificar si la ruta requiere autenticación
  const requiresAuth = 
    AUTH_ONLY_ROUTES.some(route => path.startsWith(route)) ||
    PROTECTED_ROUTES.some(route => path.startsWith(route)) ||
    ADMIN_ROUTES.some(route => path.startsWith(route))

  if (requiresAuth && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirect', path)
    return NextResponse.redirect(url)
  }

  // ✅ NUEVO: Verificar si es admin PRIMERO (antes de verificar subscription)
  if (user && PROTECTED_ROUTES.some(route => path.startsWith(route))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Si es admin, permitir acceso sin verificar subscription
    if (profile?.role === 'admin') {
      return supabaseResponse
    }

    // Si no es admin, verificar subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .or('status.eq.active,status.eq.trial')
      .single()

    // Verificar si la subscripción es válida
    const now = new Date()
    const isValidSubscription = subscription && (
      (subscription.status === 'active' && 
       subscription.subscription_end_date && 
       new Date(subscription.subscription_end_date) > now) ||
      (subscription.status === 'trial' && 
       subscription.trial_end_date && 
       new Date(subscription.trial_end_date) > now)
    )

    if (!isValidSubscription) {
      const url = request.nextUrl.clone()
      url.pathname = '/paywall'
      return NextResponse.redirect(url)
    }
  }

  // Verificar acceso de admin
  if (ADMIN_ROUTES.some(route => path.startsWith(route))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/mi-santuario'
      return NextResponse.redirect(url)
    }
  }

  // Redirigir usuarios con subscripción activa que intentan acceder a paywall/trial/fundadores
  if (user && (path === '/paywall' || path === '/trial' || path === '/acceso-fundador')) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .or('status.eq.active,status.eq.trial')
      .single()

    const now = new Date()
    const isValidSubscription = subscription && (
      (subscription.status === 'active' && 
       subscription.subscription_end_date && 
       new Date(subscription.subscription_end_date) > now) ||
      (subscription.status === 'trial' && 
       subscription.trial_end_date && 
       new Date(subscription.trial_end_date) > now)
    )

    if (isValidSubscription) {
      const url = request.nextUrl.clone()
      url.pathname = '/mi-santuario'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
