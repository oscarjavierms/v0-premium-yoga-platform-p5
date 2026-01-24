"use client"

import { useState } from "react"
import { Plus, Eye, Edit, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ProgramForm } from "./program-form" 
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { EmptyState } from "../components/empty-state"

export function ProgramsClient({ programs: initialPrograms, instructors }: any) {
  const [programs, setPrograms] = useState(initialPrograms)
  const [search, setSearch] = useState("")
  
  // Estos estados controlan el Formulario
  const [formOpen, setFormOpen] = useState(false)
  const [editingProgram, setEditingProgram] = useState<any>(null)

  // Función para abrir el formulario vacío (Nuevo)
  const handleNew = () => {
    setEditingProgram(null)
    setFormOpen(true)
  }

  // Función para abrir el formulario con datos (Editar)
  const handleEdit = (program: any) => {
    setEditingProgram(program)
    setFormOpen(true)
  }

  const filteredPrograms = programs.filter((p: any) => 
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif">Programas</h1>
          <p className="text-sm text-muted-foreground">{programs.length} programas totales</p>
        </div>
        <Button onClick={handleNew} className="gap-2 bg-black text-white">
          <Plus className="w-4 h-4" /> Nuevo programa
        </Button>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 font-serif uppercase tracking-wider">Título</th>
              <th className="text-right px-6 py-4 font-serif uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredPrograms.map((program: any) => (
              <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{program.title}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(program)}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EL FORMULARIO: Solo se activa cuando formOpen es true */}
      {formOpen && (
        <ProgramForm 
          open={formOpen} 
          onOpenChange={setFormOpen}
          program={editingProgram} 
          instructors={instructors}
        />
      )}
    </>
  )
}
