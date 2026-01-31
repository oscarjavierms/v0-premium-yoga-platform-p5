import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Solo configuramos cookies si estamos en el navegador
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: typeof window !== 'undefined' ? {
        name: 'sb-auth-token',
        sameSite: 'lax',
        secure: true,
        path: '/',
      } : {}, // En el servidor (build) enviamos un objeto vacío para que no explote
    }
  )
}

export const createBrowserClientInstance = createClient
