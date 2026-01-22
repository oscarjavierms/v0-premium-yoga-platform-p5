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
        
        <Link href="/mi-santuario" className="text-2xl font-bold tracking-tighter text-black">
          Santuario
        </Link>

        {/* Menú principal con Mi Práctica añadida */}
        <nav className="hidden md:flex items-center gap-10 text-[12px] uppercase tracking-widest font-medium text-black/60">
          <Link href="/yoga" className="hover:text-black transition-colors">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black transition-colors">Meditación</Link>
          <Link href="/fitness" className="hover:text-black transition-colors">Fitness</Link>
          <Link href="/instructores" className="hover:text-black transition-colors">Instructores</Link>
          <Link href="/mi-practica" className="hover:text-black transition-colors font-bold text-black">Mi Práctica</Link>
        </nav>

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
