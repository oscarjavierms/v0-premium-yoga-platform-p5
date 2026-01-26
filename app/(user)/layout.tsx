"use client" // Necesario para que el botón funcione



import { useState } from "react"

import { UserHeader } from "@/components/layout/user-header"

import { UserSidebar } from "@/components/layout/user-sidebar"



export default function UserLayout({ children }: { children: React.ReactNode }) {

  // Este es el estado que controla si el menú se ve o no

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)



  return (

    <div className="relative min-h-screen bg-background">

      {/* El Header se mantiene fijo arriba */}

      <UserHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

      

      {/* El Sidebar aparece sobre el contenido */}

      <UserSidebar 

        isOpen={isSidebarOpen} 

        onClose={() => setIsSidebarOpen(false)} 

      />

      

      {/* 1. Eliminado el filtro 'blur-md' y la transición lenta.

          2. Mantenemos 'pt-32' para que el contenido de Yoga/Meditación no choque con el menú.

      */}

      <main className="pt-32 px-6 md:px-12">

        <div className="max-w-7xl mx-auto">

          {children}

        </div>

      </main>

    </div>

  )

}
