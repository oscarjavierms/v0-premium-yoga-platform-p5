"use client"

import { useState } from "react"
import Link from "next/link"
import { UserSidebar } from "./UserSidebar"
import { User, Search } from "lucide-react"

export function UserHeader({ user }: { user: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1800px] mx-auto px-8 h-20 flex items-center justify-between">
        
        {/* LOGO IZQUIERDA */}
        <Link href="/dashboard" className="text-2xl font-serif italic tracking-tighter">
          Santuario
        </Link>

        {/* NAVEGACIÓN CENTRAL (Minimalista) */}
        <nav className="hidden md:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] text-black/50">
          <Link href="/yoga" className="hover:text-black transition-colors">Clases</Link>
          <Link href="/instructores" className="hover:text-black transition-colors">Guías</Link>
          <Link href="/programas" className="hover:text-black transition-colors">Programas</Link>
        </nav>

        {/* BOTÓN PERFIL DERECHA */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-4 group"
          >
            <span className="hidden md:block text-[9px] uppercase tracking-[0.2em] text-black/40 group-hover:text-black transition-colors">
              {user?.full_name || "Mi Cuenta"}
            </span>
            <div className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center bg-transparent group-hover:bg-black group-hover:text-white transition-all duration-500">
              <User size={17} strokeWidth={1} />
            </div>
          </button>
        </div>
      </div>

      {/* Llamada a la Sidebar (El archivo que creaste antes) */}
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={{ name: user?.full_name, email: user?.email }}
      />
    </header>
  )
}
