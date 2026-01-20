"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Eye, Edit, Trash2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ClassForm } from "./class-form"
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { EmptyState } from "../components/empty-state"
import { deleteClass } from "@/lib/actions/classes"
import { PILLAR_LABELS, LEVEL_LABELS } from "@/types/content"

interface ClassItem {
  id: string
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  vimeo_id: string | null
  duration_minutes: number | null
  difficulty: string
  pillar: string
  instructor_id: string | null
  program_id: string | null
  program_order: number | null
  is_free: boolean
  is_published: boolean
  instructor?: { name: string } | null
  program?: { title: string } | null
}

interface Instructor {
  id: string
  name: string
}

interface Program {
  id: string
  title: string
}

interface ClassesClientProps {
  classes: ClassItem[]
  instructors: Instructor[]
  programs: Program[]
}

export function ClassesClient({ classes: initialClasses, instructors, programs }: ClassesClientProps) {
  const [classes] = useState(initialClasses)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [instructorFilter, setInstructorFilter] = useState<string>("all")
  const [formOpen, setFormOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredClasses = classes.filter((classItem) => {
    const matchesSearch = classItem.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && classItem.is_published) ||
      (statusFilter === "draft" && !classItem.is_published)
    const matchesLevel = levelFilter === "all" || classItem.difficulty === levelFilter
    const matchesInstructor = instructorFilter === "all" || classItem.instructor_id === instructorFilter
    return matchesSearch && matchesStatus && matchesLevel && matchesInstructor
  })

  const handleEdit = (classItem: ClassItem) => {
    setEditingClass(classItem)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    setDeleteLoading(true)
    const result = await deleteClass(deletingId)
    setDeleteLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Clase eliminada")
      setDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium">Clases</h1>
          <p className="text-muted-foreground mt-1">{classes.length} clases en total</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingClass(null)
            setFormOpen(true)
          }}
        >
          <Plus className="w-4 h-4" />
          Nueva clase
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <Input
          placeholder="Buscar clases..."
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
            <SelectItem value="published">Publicadas</SelectItem>
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
        <Select value={instructorFilter} onValueChange={setInstructorFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Instructor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {instructors.map((instructor) => (
              <SelectItem key={instructor.id} value={instructor.id}>
                {instructor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredClasses.length === 0 ? (
        <EmptyState
          icon={Video}
          title="Sin clases"
          description={search || statusFilter !== "all" ? "No se encontraron clases" : "Aún no has creado clases"}
        />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium">Título</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Categoría</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Nivel</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Duración</th>
                <th className="text-left px-6 py-4 text-sm font-medium">Estado</th>
                <th className="text-right px-6 py-4 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClasses.map((classItem) => (
                <tr key={classItem.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{classItem.title}</p>
                      <p className="text-sm text-muted-foreground">{classItem.instructor?.name || "Sin instructor"}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{PILLAR_LABELS[classItem.pillar as keyof typeof PILLAR_LABELS]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{LEVEL_LABELS[classItem.difficulty as keyof typeof LEVEL_LABELS]}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm">{classItem.duration_minutes || "-"} min</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          classItem.is_published ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {classItem.is_published ? "Publicada" : "Borrador"}
                      </span>
                      {classItem.is_free && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          Gratis
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/clase/${classItem.slug}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(classItem)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => {
                          setDeletingId(classItem.id)
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

      <ClassForm
        open={formOpen}
        onOpenChange={setFormOpen}
        classItem={editingClass}
        instructors={instructors}
        programs={programs}
        onSuccess={() => setEditingClass(null)}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="¿Eliminar clase?"
        description="Se eliminará la clase permanentemente junto con el progreso de los usuarios."
      />
    </>
  )
}
