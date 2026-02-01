import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { getInstructor } from '@/lib/actions/instructors'
import { createClient } from '@/lib/supabase/server'

export default async function InstructorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  const instructor = await getInstructor(slug)

  if (!instructor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Instructor no encontrado</h1>
          <Link href="/instructores" className="text-blue-500 hover:underline">
            Volver a instructores
          </Link>
        </div>
      </div>
    )
  }

  const supabase = await createClient()
  const { data: programs } = await supabase
    .from('programs')
    .select('id, title, slug, thumbnail_url, duration_weeks, description')
    .eq('instructor_id', instructor.id)
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-white">
      <div className="w-screen relative -ml-[calc((100vw-100%)/2)]">
        <div className="relative w-full aspect-[28/9] -mt-12 bg-gradient-to-b from-black/5 to-black/20">
          {instructor.cover_url ? (
            <Image
              src={instructor.cover_url}
              alt={`${instructor.name} - Portada`}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-b from-blue-100 to-blue-50" />
          )}

          {instructor.avatar_url && (
            <Image
              src={instructor.avatar_url}
              alt={instructor.name}
              width={160}
              height={160}
              className="absolute bottom-0 translate-y-1/2 left-6 w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              unoptimized
            />
          )}
        </div>
      </div>

      <div className="mt-20 px-6 md:px-12 py-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {instructor.name}
        </h1>

        {instructor.bio && (
          <p className="text-lg text-gray-600 mt-4 leading-relaxed max-w-2xl">
            {instructor.bio}
          </p>
        )}

        {instructor.specialty && instructor.specialty.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Especialidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {instructor.specialty.map((specialty: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {instructor.instagram_url && (
          <div className="mt-8">
            <a href={instructor.instagram_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition">
              <Instagram className="w-5 h-5" />
              Sígueme en Instagram
            </a>
          </div>
        )}

        <div className="border-t border-gray-200 my-12" />

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Programas de {instructor.name} ({programs?.length || 0})
          </h2>

          {programs && programs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program: any) => (
                <Link
                  key={program.id}
                  href={`/programas/${program.slug || program.id}`}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100 rounded-lg mb-4">
                    {program.thumbnail_url ? (
                      <Image
                        src={program.thumbnail_url}
                        alt={program.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                    {program.title}
                  </h3>
                  {program.duration_weeks && (
                    <p className="text-sm text-gray-500 mt-2">
                      {program.duration_weeks} semanas
                    </p>
                  )}
                  {program.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {program.description}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                Próximamente {instructor.name} lanzará sus programas.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <Link 
            href="/instructores"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            ← Volver a instructores
          </Link>
        </div>
      </div>
    </div>
  )
}
