"use client"
import { useState } from "react"
import { UserHeader } from "@/components/layout/user-header"
import { UserSidebar } from "@/components/layout/user-sidebar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-[#F9F9F9]">
      {/* Pasamos la función para abrir el menú */}
      <UserHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      {/* Pasamos el estado y la función para cerrar el menú */}
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
