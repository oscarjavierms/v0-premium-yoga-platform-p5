import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

let supabaseInstance: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createClient() {
  // ✅ Singleton pattern para evitar múltiples instancias
  if (supabaseInstance) {
    return supabaseInstance
  }

  supabaseInstance = createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // ✅ Configuración para Safari iOS
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // ✅ Habilitar almacenamiento de sesión en localStorage como backup
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        // ✅ Configuración de cookies para Safari
        flowType: 'pkce',
      },
      // ✅ Headers para mejor compatibilidad
      headers: {
        'X-Client-Info': 'supabase-js-browser',
      },
      // ✅ Configurar realtime para funcionar mejor en Safari
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  )

  // ✅ Monitorear cambios de sesión para Safari
  if (typeof window !== 'undefined') {
    supabaseInstance.auth.onAuthStateChange((event, session) => {
      console.log('[Supabase Auth] Event:', event, 'Session:', session?.user?.email)

      // ✅ En Safari, asegurar que la sesión se persiste
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          // Guardar sesión en localStorage como backup
          if (session) {
            window.localStorage.setItem(
              'supabase.auth.token',
              JSON.stringify({
                access_token: session.access_token,
                refresh_token: session.refresh_token,
                user: session.user,
              })
            )
          }
        } catch (error) {
          console.error('[Supabase] Error guardando sesión:', error)
        }
      }

      if (event === 'SIGNED_OUT') {
        try {
          window.localStorage.removeItem('supabase.auth.token')
        } catch (error) {
          console.error('[Supabase] Error limpiando sesión:', error)
        }
      }
    })
  }

  return supabaseInstance
}

// Alias for compatibility
export const createBrowserClient = createClient

// ✅ Función helper para resetear la instancia en caso de problemas
export function resetSupabaseClient() {
  supabaseInstance = null
}

// ✅ Función para obtener la sesión con retry para Safari
export async function getSessionWithRetry(maxAttempts = 3) {
  const supabase = createClient()
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error(`[Supabase] Intento ${attempts + 1}: Error obteniendo sesión:`, error)
        attempts++
        
        // Esperar antes de reintentar (backoff exponencial)
        if (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 100))
        }
        continue
      }

      if (session) {
        console.log('[Supabase] Sesión obtenida exitosamente')
        return session
      }

      return null
    } catch (error) {
      console.error(`[Supabase] Intento ${attempts + 1}: Error inesperado:`, error)
      attempts++

      if (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 100))
      }
    }
  }

  console.error('[Supabase] No se pudo obtener sesión después de múltiples intentos')
  return null
}
