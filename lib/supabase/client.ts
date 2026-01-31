import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Esta configuración es la que acepta Next.js 15/16 y arregla Safari
      cookies: {
        getAll() {
          return typeof window !== 'undefined' 
            ? document.cookie.split('; ').map(c => {
                const [name, ...v] = c.split('=')
                return { name, value: v.join('=') }
              })
            : []
        },
        setAll(cookiesToSet) {
          if (typeof window !== 'undefined') {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Aquí forzamos 'Lax' para que tu Proxy y Safari se lleven bien
              let cookieStr = `${name}=${value}; Path=/; SameSite=Lax; Secure`
              document.cookie = cookieStr
            })
          }
        },
      },
    }
  )
}

export const createBrowserClientInstance = createClient()
