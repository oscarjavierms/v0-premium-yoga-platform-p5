import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ProgramForm } from '../program-form'

export default async function EditProgramPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get(name) { return cookieStore.get(name)?.value } } }
  )

  // Buscamos el programa específico
  const { data: program } = await supabase
    .from('programs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!program) return notFound()

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-serif mb-8">Editar Programa</h1>
      {/* Aquí cargamos el formulario con los datos ya llenos */}
      <ProgramForm initialData={program} />
    </div>
  )
}
