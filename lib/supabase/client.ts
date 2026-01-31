import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // Esto evita que Vercel explote durante el build al generar /perfil
      cookies: {
        get(name: string) { return "" },
        set(name: string, value: string, options: any) {},
        remove(name: string, options: any) {},
      }
    }
  )
}

export const createBrowserClientInstance = createClient()
