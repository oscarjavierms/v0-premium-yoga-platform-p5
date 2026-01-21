"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, User, Mail, Calendar, Clock, BookOpen, Heart, Settings, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

interface ProfileClientProps {
  user: any
  profile: any
  stats: {
    completedClasses: number
    favoritesCount: number
    totalMinutes: number
    memberSince: string
  }
}

export default function ProfileClient({ user, profile, stats }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(profile?.full_name || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    const supabase = createClient()
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    setIsSaving(false)
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
    })
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-background/70 hover:text-background transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Link>
          <h1 className="font-serif text-4xl md:text-5xl font-medium">Mi Cuenta</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile info */}
            <section className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-medium">Información personal</h2>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Editar
                  </Button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nombre completo</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email} disabled className="bg-muted" />
                    <p className="text-xs text-muted-foreground">El email no se puede cambiar</p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Guardando..." : "Guardar cambios"}
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 py-3 border-b border-border">
                    <User className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nombre</p>
                      <p className="font-medium">{profile?.full_name || "Sin nombre"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-3 border-b border-border">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Miembro desde</p>
                      <p className="font-medium">{stats.memberSince ? formatDate(stats.memberSince) : "—"}</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Quick Links */}
            <section className="space-y-3">
              <Link
                href="/favoritos"
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Mis favoritos</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>

              <Link
                href="/suscripcion"
                className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <span className="font-medium">Gestionar suscripción</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </Link>
            </section>
          </div>

          {/* Sidebar - Stats */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-medium mb-6">Tu actividad</h3>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-medium">{stats.completedClasses}</p>
                    <p className="text-sm text-muted-foreground">Clases completadas</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-medium">{stats.totalMinutes}</p>
                    <p className="text-sm text-muted-foreground">Minutos de práctica</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-medium">{stats.favoritesCount}</p>
                    <p className="text-sm text-muted-foreground">Clases guardadas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-medium mb-4 text-red-600">Zona de peligro</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Eliminar tu cuenta borrará permanentemente todos tus datos y progreso.
              </p>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 bg-transparent"
              >
                Eliminar cuenta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
