"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LogOut, Settings, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

export function UserHeader() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { name: "YOGA", href: "/yoga" },
    { name: "MEDITACIÓN", href: "/meditacion" },
    { name: "FITNESS", href: "/fitness" },
    { name: "INSTRUCTORES", href: "/instructores" },
  ]

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-black/[0.05] z-[100]">
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
        <Link href="/mi-santuario" className="font-serif text-xl text-black">
          SANTUARIO
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[10px] tracking-[0.2em] font-bold transition-colors",
                pathname === item.href ? "text-black" : "text-black/40 hover:text-black/70"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* MENÚ DE USUARIO MANUAL (Sin dependencias externas) */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full border border-black/5 hover:bg-black/5 transition-all outline-none bg-white shadow-sm"
          >
            <User size={20} strokeWidth={1.5} className="text-black/70" />
          </button>

          {isOpen && (
            <>
              {/* Fondo invisible para cerrar al hacer clic fuera sin desenfocar */}
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
              
              <div className="absolute right-0 mt-2 w-48 bg-white border border-black/5 shadow-xl rounded-lg p-2 animate-in fade-in zoom-in duration-200">
                <Link href="/perfil" className="flex items-center p-2 text-[10px] font-bold tracking-widest hover:bg-black/[0.03] rounded uppercase">
                  <Settings className="mr-2 h-4 w-4 opacity-40" /> AJUSTES
                </Link>
                <Link href="/mi-practica" className="flex items-center p-2 text-[10px] font-bold tracking-widest hover:bg-black/[0.03] rounded uppercase">
                  <Heart className="mr-2 h-4 w-4 opacity-40" /> FAVORITOS
                </Link>
                <div className="h-px bg-black/5 my-1" />
                <button className="w-full flex items-center p-2 text-[10px] font-bold tracking-widest text-red-600 hover:bg-red-50 rounded uppercase">
                  <LogOut className="mr-2 h-4 w-4" /> CERRAR SESIÓN
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
