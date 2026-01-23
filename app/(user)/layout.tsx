"use client" // Necesario para que el botón funcione

import { useState } from "react"
import { UserHeader } from "@/components/layout/user-header"
import { UserSidebar } from "@/components/layout/user-sidebar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  // Este es el estado que controla si el menú se ve o no
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen">
      {/* Le pasamos la orden de abrir al Header */}
      <UserHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      {/* Le pasamos el estado y la orden de cerrar al Sidebar */}
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* El contenido de la página se desenfoca suavemente al abrir el menú */}
      <main className={`transition-all duration-700 ${isSidebarOpen ? 'blur-md' : ''}`}>
        {children}
      </main>
    </div>
  )
}
