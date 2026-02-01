import Image from 'next/image'
import Link from 'next/link'
import { Instagram } from 'lucide-react'
import { getInstructor } from '@/lib/actions/instructors'

// ⚠️ IMPORTANTE: NO es 'use client' porque necesita hacer fetch en servidor

export default async function InstructorPage({ params }) {
  // 1. OBTENER DATOS DEL INSTRUCTOR
  const instructor = await getInstructor(params.slug)

  // 2. VALIDAR QUE EXISTA
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

  // 3. RENDERIZAR LA PÁGINA CON LOS DATOS
  return (
    <div className="min-h-screen bg-white">
      {/* PORTADA + FOTO DE PERFIL EN OVERLAP */}
      <div className="pt-0">
        <div className="relative w-full aspect-[21/9] bg-gradient-to-b from-black/5 to-black/20">
          {/* PORTADA */}
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

          {/* FOTO DE PERFIL EN OVERLAP - CAMBIO 2 */}
          {instructor.avatar_url && (
            <Image
              src={instructor.avatar_url}
              alt={instructor.name}
              width={128}
              height={128}
              className="absolute bottom-0 translate-y-1/2 left-6
                         w-32 h-32 rounded-full border-4 border-white
                         shadow-lg object-cover"
              unoptimized
            />
          )}
        </div>
      </div>

      {/* CONTENIDO - Con espacio para la foto de perfil */}
      <div className="mt-20 px-6 md:px-12 py-8 max-w-4xl mx-auto">
        
        {/* NOMBRE */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          {instructor.name}
        </h1>

        {/* BIO */}
        {instructor.bio && (
          <p className="text-lg text-gray-600 mt-4 leading-relaxed max-w-2xl">
            {instructor.bio}
          </p>
        )}

        {/* ESPECIALIDADES - CAMBIO 3 */}
        {instructor.specialty && instructor.specialty.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Especialidades
            </h3>
            <div className="flex flex-wrap gap-2">
              {instructor.specialty.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1
                             bg-black text-white text-sm font-medium
                             rounded-full hover:bg-gray-800 transition"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* INSTAGRAM */}
        {instructor.instagram_url && (
          <div className="mt-8">
            <a
              href={instructor.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2
                         bg-gradient-to-r from-purple-500 to-pink-500
                         text-white font-medium rounded-lg
                         hover:opacity-90 transition"
            >
              <Instagram className="w-5 h-5" />
              Sígueme en Instagram
            </a>
          </div>
        )}

        {/* DIVIDER */}
        <div className="border-t border-gray-200 my-12" />

        {/* SECCIÓN ADICIONAL */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Sobre esta clase
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Explora las clases y programas que ofrece {instructor.name}.
            Reserva tu sesión y comienza tu viaje hacia el bienestar.
          </p>
        </div>

        {/* VOLVER */}
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
