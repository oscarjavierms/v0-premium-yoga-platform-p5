"use client"

import { useState } from "react"
import Link from "next/link"
import { UserSidebar } from "./UserSidebar" // Importamos la Sidebar
import { User } from "lucide-react"

export function UserHeader({ user }: { user: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-black/5">
      <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Tu Logo Original */}
        <Link href="/" className="text-xl font-bold tracking-tighter">
          Santuario
        </Link>

        {/* Mantenemos tus links de navegación originales */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/yoga" className="text-sm font-medium">Yoga</Link>
          <Link href="/instructores" className="text-sm font-medium">Instructores</Link>
          <Link href="/programas" className="text-sm font-medium">Programas</Link>
        </nav>

        {/* El botón de usuario que ahora abre la Sidebar */}
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User size={18} />
            </div>
          </button>
        </div>
      </div>

      {/* Renderizamos la Sidebar aquí */}
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={{ name: user?.full_name, email: user?.email }}
      />
    </header>
  )
}
