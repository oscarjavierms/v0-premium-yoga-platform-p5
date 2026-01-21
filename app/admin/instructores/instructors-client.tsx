"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Edit, Trash2, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { InstructorForm } from "./instructor-form"
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { EmptyState } from "../components/empty-state"
import { deleteInstructor } from "@/lib/actions/instructors"

interface Instructor {
  id: string
  name: string
  slug: string
  bio: string | null
  specialty: string[] | null
  avatar_url: string | null
  instagram_url: string | null
  classCount: number
}

interface InstructorsClientProps {
  instructors: Instructor[]
}

export function InstructorsClient({ instructors: initialInstructors }: InstructorsClientProps) {
  const [instructors] = useState(initialInstructors)
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(search.toLowerCase()) ||
      instructor.specialty?.some((s) => s.toLowerCase().includes(search.toLowerCase())),
  )

  const handleEdit = (instructor: Instructor) => {
    setEditingInstructor(instructor)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deletingId) return

    setDeleteLoading(true)
    const result = await deleteInstructor(deletingId)
    setDeleteLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Instructor eliminado")
      setDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif font-medium">Profesores</h1>
          <p className="text-muted-foreground mt-1">{instructors.length} profesores</p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setEditingInstructor(null)
            setFormOpen(true)
          }}
        >
          <Plus className="w-4 h-4" />
          Nuevo profesor
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Buscar profesores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredInstructors.length === 0 ? (
        <EmptyState
          icon={UserCircle}
          title="Sin profesores"
          description={search ? "No se encontraron profesores con ese término" : "Aún no has añadido profesores"}
          actionLabel={!search ? "Añadir profesor" : undefined}
          actionHref={undefined}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((instructor) => (
            <div key={instructor.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
                  {instructor.avatar_url ? (
                    <Image
                      src={instructor.avatar_url || "/placeholder.svg"}
                      alt={instructor.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-medium">
                      {instructor.name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium">{instructor.name}</h3>
                  {instructor.specialty && instructor.specialty.length > 0 && (
                    <p className="text-sm text-muted-foreground">{instructor.specialty.slice(0, 2).join(", ")}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-muted-foreground">{instructor.classCount} clases</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-2 bg-transparent"
                  onClick={() => handleEdit(instructor)}
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                  onClick={() => openDeleteDialog(instructor.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <InstructorForm
        open={formOpen}
        onOpenChange={setFormOpen}
        instructor={editingInstructor}
        onSuccess={() => setEditingInstructor(null)}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="¿Eliminar profesor?"
        description="Se eliminará el profesor permanentemente. Las clases asociadas quedarán sin instructor."
      />
    </>
  )
}
