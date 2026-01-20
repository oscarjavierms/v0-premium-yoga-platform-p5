"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Eye, Edit, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ProgramForm } from "./program-form"
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { EmptyState } from "../components/empty-state"
import { deleteProgram } from "@/lib/actions/programs"
import { PILLAR_LABELS, LEVEL_LABELS } from "@/types/content"

interface Program {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  duration_weeks: number | null
  difficulty: string
  pillar: string
  instructor_id: string | null
  is_featured: boolean
  is_published: boolean
  instructor?: { name: string } | null
  classCount?: number
}

interface Instructor {
  id: string
  name: string
}

interface ProgramsClientProps {
  programs: Program[]
  instructors: Instructor[]
}

export function ProgramsClient({ programs: initialPrograms, instructors }: ProgramsClientProps) {
  const [programs] = useState(initialPrograms)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<Program | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredPrograms = programs.filter((program) => {
    const matchesSearch = program.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && program.is_published) ||
      (statusFilter === "draft" && !program.is_published)
    const matchesLevel = levelFilter === "all" || program.difficulty === levelFilter
    return matchesSearch && matchesStatus && matchesLevel
  })

  const handleEdit = (program: Program) => {
    setEditingProgram(program)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    setDeleteLoading(true)
    const result = await deleteProgram(deletingId)
    setDeleteLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Programa eliminado")
      setDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium">Programas</h1>
          <p className="text-muted-foreground mt-1">{programs.length} programas en total</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingProgram(null)
            setFormOpen(true)
          }}
        >
          <Plus className="w-4 h-4" />
          Nuevo programa
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar programas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="published">Publicados</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
          </SelectContent>
        </Select>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Nivel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {Object.entries(LEVEL_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredPrograms.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Sin programas"
          description={search || statusFilter !== "all" ? "No se encontraron programas" : "Aún no has creado programas"}
        />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium">Título</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Categoría</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Nivel</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Clases</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Estado</th>
                <th className="text-right px-6 py-4 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPrograms.map((program) => (
                <tr key={program.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{program.title}</p>
                      <p className="text-sm text-muted-foreground">{program.instructor?.name || "Sin instructor"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{PILLAR_LABELS[program.pillar as keyof typeof PILLAR_LABELS]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{LEVEL_LABELS[program.difficulty as keyof typeof LEVEL_LABELS]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{program.classCount || 0}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          program.is_published ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {program.is_published ? "Publicado" : "Borrador"}
                      </span>
                      {program.is_featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          Destacado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/programa/${program.slug}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(program)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setDeletingId(program.id)
                          setDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProgramForm
        open={formOpen}
        onOpenChange={setFormOpen}
        program={editingProgram}
        instructors={instructors}
        onSuccess={() => setEditingProgram(null)}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="¿Eliminar programa?"
        description="Se eliminará el programa permanentemente. Las clases asociadas quedarán sin programa."
      />
    </>
  )
}
