"use client"

import { useState } from "react"
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

export function ProgramsClient({ programs: initialPrograms, instructors }: any) {
  const [programs, setPrograms] = useState(initialPrograms)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<any>(null)
  const [search, setSearch] = useState("")

  const handleEdit = (program: any) => {
    setEditingProgram(program) // Pasamos los datos del programa
    setFormOpen(true)          // Abrimos el formulario
  }

  const handleNew = () => {
    setEditingProgram(null)    // Limpiamos datos para nuevo programa
    setFormOpen(true)          // Abrimos el formulario
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif">Programas</h1>
        <Button onClick={handleNew} className="gap-2">
          <Plus className="w-4 h-4" /> Nuevo programa
        </Button>
      </div>

      {/* Tabla de programas con botón de editar corregido */}
      <div className="bg-card border rounded-xl overflow-hidden">
        <table className="w-full">
          <tbody className="divide-y">
            {programs.map((program: any) => (
              <tr key={program.id} className="hover:bg-muted/30">
                <td className="px-6 py-4 font-medium">{program.title}</td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(program)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EL FORMULARIO: Ahora es un modal real que recibe datos */}
      <ProgramForm 
        open={formOpen} 
        onOpenChange={setFormOpen}
        program={editingProgram} 
        instructors={instructors}
      />
    </>
  )
}
