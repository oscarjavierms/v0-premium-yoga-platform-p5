# Configuración de OAuth (Google y Facebook)

## Error Actual

Si ves este error al intentar usar Google o Facebook login:

```json
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

Significa que los providers de OAuth no están habilitados en tu proyecto de Supabase.

## Solución: Habilitar Google y Facebook en Supabase

### 1. Acceder a la configuración de Authentication

1. Ve a tu proyecto en Supabase Dashboard
2. Click en "Authentication" en el menú lateral
3. Click en "Providers"

### 2. Configurar Google OAuth

1. Busca "Google" en la lista de providers
2. Click en "Enable"
3. Necesitarás crear credenciales en Google Cloud Console:
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Ve a "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client ID"
   - Tipo de aplicación: "Web application"
   - Authorized redirect URIs: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   
4. Copia el Client ID y Client Secret
5. Pégalos en Supabase en los campos correspondientes
6. Click "Save"

### 3. Configurar Facebook OAuth

1. Busca "Facebook" en la lista de providers
2. Click en "Enable"
3. Necesitarás crear una app en Facebook Developers:
   - Ve a [Facebook Developers](https://developers.facebook.com/)
   - Click "My Apps" > "Create App"
   - Selecciona "Consumer" como tipo de app
   - Agrega "Facebook Login" al producto
   - En "Facebook Login" > "Settings":
     - Valid OAuth Redirect URIs: `https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`
   
4. Ve a "Settings" > "Basic" para obtener:
   - App ID
   - App Secret
   
5. Copia el App ID y App Secret
6. Pégalos en Supabase en los campos correspondientes
7. Click "Save"

### 4. Verificar configuración

Después de habilitar los providers, el login con Google y Facebook debería funcionar correctamente.

## URLs de Callback importantes

Para desarrollo local, también puedes agregar:
- `http://localhost:3000/auth/callback`

Para producción (Vercel), usa:
- `https://tu-dominio.vercel.app/auth/callback`

## Notas importantes

- Los usuarios que se registren con Google o Facebook tendrán su email automáticamente verificado
- No necesitas verificación de email adicional para OAuth providers
- El flujo de OAuth redirige automáticamente después del login exitoso
