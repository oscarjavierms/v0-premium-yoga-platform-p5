// Dentro de components/layout/user-header.tsx
"use client"

import { useState } from "react"
import { UserSidebar } from "./UserSidebar" // El nuevo archivo que crearás

export function UserHeader({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="flex items-center justify-between px-8 py-4 border-b border-black/5">
        {/* Tu Logo y Nav actual... mantén lo que tienes a la izquierda */}
        
        <div className="flex items-center gap-6">
          <button className="text-[10px] uppercase tracking-widest text-black/40 hover:text-black transition">
            Buscar
          </button>

          {/* FOTO DE PERFIL: Al hacer clic, abre la Sidebar de lujo */}
          <button 
            onClick={() => setIsOpen(true)}
            className="h-8 w-8 rounded-full bg-black flex items-center justify-center text-[10px] text-white overflow-hidden hover:scale-110 transition-transform"
          >
            {user?.image ? <img src={user.image} /> : "OM"}
          </button>
        </div>
      </header>

      {/* Insertamos la Sidebar aquí */}
      <UserSidebar 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        user={user} 
      />
    </>
  )
}
