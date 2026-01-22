"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"

export default function PerfilPage() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="max-w-2xl p-12">
      <header className="mb-12">
        <h1 className="font-serif text-4xl italic mb-2">Mi Perfil</h1>
        <p className="text-gray-500 font-light text-lg">Personaliza tu espacio y presencia en el santuario.</p>
      </header>

      <section className="space-y-10">
        {/* AVATAR SECTION */}
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="h-32 w-32 rounded-full bg-gray-100 border border-black/5 overflow-hidden flex items-center justify-center">
              <span className="text-gray-300 font-serif text-3xl italic">O</span>
            </div>
            <button className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <Camera className="text-white" size={24} />
            </button>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Foto de perfil</h3>
            <p className="text-sm text-gray-400 font-light">JPG o PNG. Máximo 1MB.</p>
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-xs uppercase tracking-widest text-gray-400">Nombre</Label>
              <Input id="firstName" placeholder="Oscar" className="rounded-none border-0 border-b border-gray-200 focus:border-black transition-colors bg-transparent px-0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-xs uppercase tracking-widest text-gray-400">Apellido</Label>
              <Input id="lastName" placeholder="Javier" className="rounded-none border-0 border-b border-gray-200 focus:border-black transition-colors bg-transparent px-0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-widest text-gray-400">Email</Label>
            <Input id="email" disabled placeholder="oscar@ejemplo.com" className="rounded-none border-0 border-b border-gray-100 bg-transparent px-0 text-gray-400" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-xs uppercase tracking-widest text-gray-400">Sobre mí (Biografía)</Label>
            <Input id="bio" placeholder="Buscando el equilibrio entre el éxito y la paz interior..." className="rounded-none border-0 border-b border-gray-200 focus:border-black transition-colors bg-transparent px-0" />
          </div>
        </div>

        <div className="pt-6">
          <Button 
            className="bg-black text-white rounded-none px-12 py-6 hover:bg-gray-900 transition-all uppercase tracking-widest text-xs"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Actualizar Perfil"}
          </Button>
        </div>
      </section>
    </div>
  )
}
