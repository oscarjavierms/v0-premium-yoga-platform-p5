"use client"
import React from "react"

export function MiSantuarioClient({ profile }: any) {
  return (
    <div className="p-20 bg-white min-h-screen text-black">
      <h1 className="font-serif text-6xl">Hola, {profile?.full_name || 'oscar'}</h1>
      <p className="mt-4 text-gray-500 italic">Bienvenido a tu santuario.</p>
    </div>
  )
}
