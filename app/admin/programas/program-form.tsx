"use client" // Muy importante que tenga esto arriba

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

interface ProgramFormProps {
  initialData?: any; // Datos del programa que vienen desde [id]/page.tsx
}

export function ProgramForm({ initialData }: ProgramFormProps) {
  const router = useRouter()

  // 1. Inicializamos el formulario. 
  // Si hay initialData, los pone; si no, lo deja vacío para crear uno nuevo.
  const form = useForm({
    defaultValues: initialData || {
      title: '',
      description: '',
      pillar: 'movement',
      category: '',
      level: 'principiante'
    }
  })

  // 2. Este efecto asegura que si los datos llegan tarde, el formulario se actualice
  useEffect(() => {
    if (initialData) {
      form.reset(initialData)
    }
  }, [initialData, form])

  const onSubmit = async (data: any) => {
    try {
      // Aquí irá tu lógica de supabase.auth...
      console.log("Guardando cambios...", data)
      router.refresh()
    } catch (error) {
      console.error("Error al guardar:", error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-black/5">
      <div className="grid gap-2">
        <label className="text-sm font-medium font-serif uppercase tracking-widest text-black/50">
          Título del Programa
        </label>
        <input
          {...form.register("title")}
          placeholder="Ej: Yoga para el despertar"
          className="flex h-12 w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-lg focus:outline-none focus:ring-1 focus:ring-black/20"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium font-serif uppercase tracking-widest text-black/50">
          Descripción
        </label>
        <textarea
          {...form.register("description")}
          rows={4}
          className="flex w-full rounded-md border border-black/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black/20"
        />
      </div>

      <button 
        type="submit"
        className="bg-black text-white px-8 py-3 rounded-full hover:bg-black/80 transition-all font-medium uppercase text-xs tracking-[0.2em]"
      >
        {initialData ? 'Actualizar Programa' : 'Crear Programa'}
      </button>
    </form>
  )
}
