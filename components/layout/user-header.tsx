"use client"

import { useState } from "react"
import Link from "next/link"
import { UserSidebar } from "./UserSidebar"
import { User } from "lucide-react"

export function UserHeader({ user }: { user: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1800px] mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tighter">
          Santuario
        </Link>

        {/* Navegación que pediste: Yoga, Meditación, Fitness, Instructores */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-black/70">
          <Link href="/yoga" className="hover:text-black transition-colors">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black transition-colors">Meditación</Link>
          <Link href="/fitness" className="hover:text-black transition-colors">Fitness</Link>
          <Link href="/instructores" className="hover:text-black transition-colors">Instructores</Link>
        </nav>

        {/* Botón de Perfil para abrir Sidebar */}
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="w-10 h-10 rounded-full border border-black/5 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <User size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Sidebar Lateral */}
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={{ name: user?.full_name, email: user?.email }}
      />
    </header>
  )
}
