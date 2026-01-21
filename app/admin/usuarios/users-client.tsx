"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, Mail, Calendar, Eye, Shield, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "../components/empty-state"

interface UserProfile {
  id: string
  email: string | null
  full_name: string | null
  role: string
  avatar_url: string | null
  created_at: string
  completedClasses: number
  totalProgress: number
}

interface UsersClientProps {
  users: UserProfile[]
}

export function UsersClient({ users }: UsersClientProps) {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium">Usuarios</h1>
          <p className="text-muted-foreground mt-1">{users.length} usuarios registrados</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="instructor">Instructor</SelectItem>
            <SelectItem value="user">Usuario</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Sin usuarios"
          description={search || roleFilter !== "all" ? "No se encontraron usuarios" : "No hay usuarios registrados"}
        />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium">Usuario</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Rol</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Progreso</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Registro</th>
                <th className="text-right px-6 py-4 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {(user.full_name?.[0] || user.email?.[0] || "?").toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.full_name || "Sin nombre"}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-700"
                          : user.role === "instructor"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {user.role === "admin" ? (
                        <Shield className="w-3 h-3" />
                      ) : user.role === "instructor" ? (
                        <User className="w-3 h-3" />
                      ) : null}
                      {user.role === "admin" ? "Admin" : user.role === "instructor" ? "Instructor" : "Usuario"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p>{user.completedClasses} completadas</p>
                      <p className="text-muted-foreground">{user.totalProgress} en progreso</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.created_at).toLocaleDateString("es-ES")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end">
                      <Link href={`/admin/usuarios/${user.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
