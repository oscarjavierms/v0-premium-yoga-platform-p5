"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Calendar, Shield, User, Video, Heart, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ConfirmDeleteDialog } from "../../components/confirm-delete-dialog"
import { PILLAR_LABELS } from "@/types/content"

interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  role: string
  avatar_url: string | null
  created_at: string
}

interface Progress {
  id: string
  progress_seconds: number
  completed: boolean
  completed_at: string | null
  updated_at: string
  class: {
    title: string
    slug: string
    duration_minutes: number | null
    pillar: string
  } | null
}

interface Favorite {
  id: string
  class: {
    title: string
    slug: string
  } | null
}

interface UserDetailClientProps {
  user: UserProfile
  progress: Progress[]
  favorites: Favorite[]
}

export function UserDetailClient({ user, progress, favorites }: UserDetailClientProps) {
  const [selectedRole, setSelectedRole] = useState(user.role)
  const [confirmRoleChange, setConfirmRoleChange] = useState(false)
  const [loading, setLoading] = useState(false)

  const completedClasses = progress.filter((p) => p.completed).length
  const inProgressClasses = progress.filter((p) => !p.completed).length
  const totalWatchTime = progress.reduce((acc, p) => acc + (p.progress_seconds || 0), 0)

  const handleRoleChange = async () => {
    setLoading(true)
    // This would call a server action to update the role
    // For now, just simulate
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(`Rol actualizado a ${selectedRole}`)
    setLoading(false)
    setConfirmRoleChange(false)
  }

  return (
    <>
      <div className="mb-8">
        <Link
          href="/admin/usuarios"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a usuarios
        </Link>
        <h1 className="text-3xl font-serif font-medium">{user.full_name || "Usuario sin nombre"}</h1>
        <p className="text-muted-foreground mt-1">{user.email}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl font-medium">
                  {(user.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium">{user.full_name || "Sin nombre"}</p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                    user.role === "admin"
                      ? "bg-purple-50 text-purple-700"
                      : user.role === "instructor"
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {user.role === "admin" ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  {user.role === "admin" ? "Admin" : user.role === "instructor" ? "Instructor" : "Usuario"}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Registrado el {new Date(user.created_at).toLocaleDateString("es-ES")}
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <label className="text-sm font-medium">Cambiar rol</label>
              <div className="flex gap-2 mt-2">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => setConfirmRoleChange(true)}
                  disabled={selectedRole === user.role}
                >
                  Guardar
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card border border-border rounded-xl p-6 mt-6">
            <h3 className="font-medium mb-4">Estadísticas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-medium">{completedClasses}</p>
                <p className="text-xs text-muted-foreground">Completadas</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-medium">{inProgressClasses}</p>
                <p className="text-xs text-muted-foreground">En progreso</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-medium">{favorites.length}</p>
                <p className="text-xs text-muted-foreground">Favoritos</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-medium">{Math.round(totalWatchTime / 60)}</p>
                <p className="text-xs text-muted-foreground">Min vistos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Favorites */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Video className="w-5 h-5" />
              Progreso de clases ({progress.length})
            </h3>
            {progress.length > 0 ? (
              <div className="space-y-3">
                {progress.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{p.class?.title || "Clase eliminada"}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.class?.pillar ? PILLAR_LABELS[p.class.pillar as keyof typeof PILLAR_LABELS] : "-"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3" />
                          {Math.round((p.progress_seconds || 0) / 60)} min
                        </div>
                        {p.class?.duration_minutes && (
                          <p className="text-xs text-muted-foreground">de {p.class.duration_minutes} min</p>
                        )}
                      </div>
                      {p.completed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Completada
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700">
                          En progreso
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Este usuario no ha visto ninguna clase</p>
            )}
          </div>

          {/* Favorites */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Clases favoritas ({favorites.length})
            </h3>
            {favorites.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-3">
                {favorites.map((fav) => (
                  <div key={fav.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                    <span className="text-sm truncate">{fav.class?.title || "Clase eliminada"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">Este usuario no tiene clases favoritas</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={confirmRoleChange}
        onOpenChange={setConfirmRoleChange}
        onConfirm={handleRoleChange}
        loading={loading}
        title="¿Cambiar rol de usuario?"
        description={`¿Estás seguro de cambiar el rol de este usuario a "${selectedRole}"? ${selectedRole === "admin" ? "Los administradores tienen acceso completo al sistema." : ""}`}
      />
    </>
  )
}
