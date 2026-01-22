"use client"

import { useState } from "react"
import Link from "next/link"
import { UserSidebar } from "./UserSidebar"
import { User } from "lucide-react"

export function UserHeader({ user }: { user: any }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-[100] bg-white border-b border-black/5 h-20">
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Nombre de la marca (actúa como Home general) */}
        <Link href="/" className="text-xl font-bold tracking-tighter text-black uppercase">
          Santuario
        </Link>

        {/* NAVEGACIÓN COMPLETA */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-black/50">
          {/* Secciones de exploración */}
          <Link href="/yoga" className="hover:text-black transition-colors">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black transition-colors">Meditación</Link>
          <Link href="/fitness" className="hover:text-black transition-colors">Fitness</Link>
          <Link href="/instructores" className="hover:text-black transition-colors">Instructores</Link>
          
          {/* Tus secciones personales (Destacadas) */}
          <div className="w-[1px] h-4 bg-black/10 mx-2" /> {/* Separador visual elegante */}
          <Link href="/mi-santuario" className="text-black hover:opacity-60 transition-opacity font-bold">Mi Santuario</Link>
          <Link href="/mi-practica" className="text-black hover:opacity-60 transition-opacity font-bold">Mi Práctica</Link>
        </nav>

        {/* Sidebar para lo administrativo */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all"
        >
          <User size={18} strokeWidth={1.5} />
        </button>
      </div>

      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user}
      />
    </header>
  )
}
