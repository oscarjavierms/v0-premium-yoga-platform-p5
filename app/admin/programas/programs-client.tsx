"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Eye, Edit, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog"
import { EmptyState } from "../components/empty-state"
import { deleteProgram } from "@/lib/actions/programs"

export function ProgramsClient({ programs: initialPrograms, instructors }: any) {
  const [programs] = useState(initialPrograms)
  const [search, setSearch] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredPrograms = programs.filter((p: any) => 
    p.title.toLowerCase().includes(search.toLowerCase())
  )

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
      window.location.reload()
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-serif">Programas</h1>
          <p className="text-sm text-muted-foreground">{programs.length} programas totales</p>
        </div>
        <Link href="/admin/programas/new">
          <Button className="gap-2 bg-black text-white">
            <Plus className="w-4 h-4" /> Nuevo programa
          </Button>
        </Link>
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
                    <Link href={`/admin/programas/${program.id}`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setDeletingId(program.id)
                        setDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="¿Eliminar programa?"
        description="Se eliminará el programa permanentemente junto con sus clases asociadas."
      />
    </>
  )
}
