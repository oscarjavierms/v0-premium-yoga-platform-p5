import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
              // 1. Obtenemos el dominio actual para "anclar" la cookie
              const domain = window.location.hostname;
              
              // 2. Construimos la cookie con Domain, Secure y SameSite=Lax
              // Esto es lo que Safari exige para confiar en el Proxy
              let cookieStr = `${name}=${value}; Path=/; SameSite=Lax; Secure; Max-Age=31536000;`;
              
              if (!domain.includes('localhost')) {
                cookieStr += ` Domain=${domain};`;
              }
              
              document.cookie = cookieStr;
            })
          }
        },
      },
    }
  )
}

export const createBrowserClientInstance = createClient()
