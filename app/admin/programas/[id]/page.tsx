import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ProgramForm } from '../program-form'

export default async function EditProgramPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerComponentClient({ cookies })

  // Traemos la información del programa específico usando el ID de la URL
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!program) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-serif">
          Editar Programa: {program.title}
        </h2>
      </div>
      <div className="grid gap-4">
        {/* Pasamos el programa encontrado al formulario que ya tienes creado */}
        <ProgramForm initialData={program} />
      </div>
    </div>
  )
}
