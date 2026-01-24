import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ProgramForm } from '../program-form'

export default async function EditProgramPage({
  params,
}: {
  params: { id: string }
}) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  // Traemos la información del programa específico
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
        <ProgramForm initialData={program} />
      </div>
    </div>
  )
}
