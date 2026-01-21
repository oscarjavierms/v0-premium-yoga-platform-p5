"use client"

import { useState } from "react"
import { Settings, Palette, Video, Shield, AlertTriangle, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export function AjustesClient() {
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Configuración guardada")
    setLoading(false)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium">Ajustes</h1>
          <p className="text-muted-foreground mt-1">Configuración de la plataforma</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <Settings className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="gap-2">
            <Palette className="w-4 h-4" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="vimeo" className="gap-2">
            <Video className="w-4 h-4" />
            Vimeo
          </TabsTrigger>
          <TabsTrigger value="roles" className="gap-2">
            <Shield className="w-4 h-4" />
            Roles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-medium mb-4">Información general</h3>
              <div className="grid gap-4 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="site_name">Nombre del sitio</Label>
                  <Input id="site_name" defaultValue="Wellness Platform" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description">Descripción</Label>
                  <Textarea
                    id="site_description"
                    defaultValue="Plataforma de bienestar para profesionales de alto rendimiento"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support_email">Email de soporte</Label>
                  <Input id="support_email" type="email" defaultValue="soporte@wellness.com" />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-medium mb-4">Configuración de contenido</h3>
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar clases gratuitas</Label>
                    <p className="text-sm text-muted-foreground">Permitir acceso sin suscripción a clases gratis</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Permitir descargas</Label>
                    <p className="text-sm text-muted-foreground">Habilitar descarga de recursos adicionales</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-medium mb-4">Identidad visual</h3>
              <div className="grid gap-4 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="logo_url">URL del logo</Label>
                  <Input id="logo_url" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="favicon_url">URL del favicon</Label>
                  <Input id="favicon_url" placeholder="https://..." />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-medium mb-4">Colores</h3>
              <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Color primario</Label>
                  <div className="flex gap-2">
                    <Input id="primary_color" defaultValue="#000000" />
                    <div className="w-10 h-10 rounded border border-border bg-black" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accent_color">Color de acento</Label>
                  <div className="flex gap-2">
                    <Input id="accent_color" defaultValue="#6B7280" />
                    <div className="w-10 h-10 rounded border border-border bg-gray-500" />
                  </div>
                </div>
              </div>
            </div>

            <Button onClick={handleSave} disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="vimeo">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Importante: Seguridad</p>
                <p className="text-sm text-amber-700 mt-1">
                  No guardes secretos en la base de datos. Usa variables de entorno en tu servidor para las credenciales
                  de Vimeo.
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">Credenciales de Vimeo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Estas credenciales se usan solo para mostrar el estado de la integración. Los valores reales deben estar
                en variables de entorno.
              </p>
              <div className="grid gap-4 max-w-xl">
                <div className="space-y-2">
                  <Label htmlFor="vimeo_client_id">VIMEO_CLIENT_ID</Label>
                  <Input id="vimeo_client_id" placeholder="Configurado en variables de entorno" disabled />
                  <p className="text-xs text-muted-foreground">
                    Variable: <code className="bg-muted px-1 rounded">VIMEO_CLIENT_ID</code>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vimeo_client_secret">VIMEO_CLIENT_SECRET</Label>
                  <Input id="vimeo_client_secret" type="password" placeholder="••••••••••••" disabled />
                  <p className="text-xs text-muted-foreground">
                    Variable: <code className="bg-muted px-1 rounded">VIMEO_CLIENT_SECRET</code>
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vimeo_access_token">VIMEO_ACCESS_TOKEN</Label>
                  <Input id="vimeo_access_token" type="password" placeholder="••••••••••••" disabled />
                  <p className="text-xs text-muted-foreground">
                    Variable: <code className="bg-muted px-1 rounded">VIMEO_ACCESS_TOKEN</code>
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-medium mb-4">Estado de la integración</h3>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Videos se cargan mediante URL/ID de Vimeo (sin API)</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="roles">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div>
              <h3 className="font-medium mb-4">Roles disponibles</h3>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Admin</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Acceso completo: gestión de contenido, usuarios, configuración y métricas.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Video className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Instructor</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Puede ver y editar sus propias clases y programas asignados.
                  </p>
                </div>
                <div className="p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Usuario</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Acceso a contenido publicado según su plan de suscripción.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border">
              <h3 className="font-medium mb-4">Permisos RLS (Row Level Security)</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Las políticas de seguridad están configuradas a nivel de base de datos en Supabase.
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>
                  • <strong>Admin:</strong> CRUD completo en todas las tablas
                </li>
                <li>
                  • <strong>Usuarios:</strong> Solo lectura de contenido publicado
                </li>
                <li>
                  • <strong>user_progress:</strong> Cada usuario solo ve/escribe su propio progreso
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}
