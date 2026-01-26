"use client"

import { useState } from "react"
import { UserHeader } from "@/components/layout/user-header"
import { UserSidebar } from "@/components/layout/user-sidebar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  // Estado para el menú lateral
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-background">
      {/* Mantenemos el Header fijo. 
          Al no tener padding el contenedor principal, 
          el contenido de las páginas podrá subir hasta el borde superior.
      */}
      <UserHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* MAIN LIMPIO: 
          He quitado el pt-32 y el max-w-7xl. 
          Ahora este layout es un lienzo en blanco.
      */}
      <main className="w-full">
        {children}
      </main>
    </div>
  )
}
