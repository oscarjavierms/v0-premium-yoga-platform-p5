"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Eye, Edit, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ProgramForm } from "./program-form" // Este es tu modal
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { EmptyState } from "../components/empty-state"
import { deleteProgram } from "@/lib/actions/programs"
import { PILLAR_LABELS, LEVEL_LABELS } from "@/types/content"

// ... (se mantienen las mismas interfaces Program e Instructor)

export function ProgramsClient({ programs: initialPrograms, instructors }: ProgramsClientProps) {
  const [programs] = useState(initialPrograms)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  
  // ESTADOS CLAVE
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

  // FUNCIÓN CORREGIDA PARA EDITAR
  const handleEdit = (program: Program) => {
    setEditingProgram(program) // Aquí le pasamos los datos del programa al estado
    setFormOpen(true)          // Aquí abrimos el modal
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
            setEditingProgram(null) // Reset para que el formulario salga vacío al ser "Nuevo"
            setFormOpen(true)
          }}
        >
          <Plus className="w-4 h-4" />
          Nuevo programa
        </Button>
      </div>

      {/* ... (Filtros e Input se mantienen igual) ... */}

      {filteredPrograms.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Sin programas"
          description={search || statusFilter !== "all" ? "No se encontraron programas" : "Aún no has creado programas"}
        />
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">Título</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">Categoría</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">Nivel</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">Clases</th>
                <th className="text-left px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">Estado</th>
                <th className="text-right px-6 py-4 text-xs uppercase tracking-wider font-semibold text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPrograms.map((program) => (
                <tr key={program.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-sm">{program.title}</p>
                    <p className="text-xs text-muted-foreground">{program.instructor?.name || "Sin instructor"}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {PILLAR_LABELS[program.pillar as keyof typeof PILLAR_LABELS]}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {LEVEL_LABELS[program.difficulty as keyof typeof LEVEL_LABELS]}
                  </td>
                  <td className="px-6 py-4 text-sm text-center md:text-left">
                    {program.classCount || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      program.is_published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {program.is_published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/programa/${program.slug}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-black">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      
                      {/* ESTE ES EL BOTÓN QUE AHORA SÍ FUNCIONA */}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-blue-600" onClick={() => handleEdit(program)}>
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-red-600"
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

      {/* EL FORMULARIO MODAL (Aparece sobre la pantalla, no abajo) */}
      <ProgramForm
        open={formOpen}
        onOpenChange={setFormOpen}
        program={editingProgram} // Aquí se pasan los datos del programa para que los inputs se llenen
        instructors={instructors}
        onSuccess={() => {
           setFormOpen(false)
           setEditingProgram(null)
        }}
      />

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="¿Eliminar programa?"
        description="Esta acción no se puede deshacer."
      />
    </>
  )
}
