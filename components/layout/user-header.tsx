"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LogOut, Settings, CreditCard, UserCircle } from "lucide-react"
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

  const secondaryItems = [
    { name: "MI SANTUARIO", href: "/mi-santuario" },
  ]

  return (
    /* Volvemos a h-20 si te sentías más cómodo con el aire que daba */
    <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-black/[0.05] z-[100]">
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/mi-santuario" className="font-serif text-xl text-black hover:text-black/60 transition-colors uppercase">
          SANTUARIO
        </Link>

        {/* Navegación Principal: Limpia y sin adornos */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[10px] tracking-[0.2em] font-bold transition-colors",
                pathname === item.href ? "text-black" : "text-black/30 hover:text-black/70"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Un separador muy, muy sutil */}
          <div className="w-px h-4 bg-black/[0.08]" />
          
          {/* MI SANTUARIO: Igual que los demás, pero con color negro sólido si está activo */}
          {secondaryItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-[10px] tracking-[0.2em] font-bold transition-colors",
                pathname === item.href ? "text-black" : "text-black/30 hover:text-black"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Menú de Usuario */}
        <div className="relative">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-3 rounded-full border border-black/5 hover:bg-black/5 transition-all outline-none bg-white shadow-sm flex items-center justify-center"
          >
            <User size={20} strokeWidth={1.5} className="text-black/70" />
          </button>

          {isOpen && (
            <>
              <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white border border-black/5 shadow-2xl rounded-xl p-2">
                {/* ... (el resto de tu menú desplegable igual que antes) ... */}
                <div className="px-3 py-2 mb-1">
                  <p className="text-[9px] tracking-[0.2em] font-bold text-black/30 uppercase">Cuenta</p>
                </div>
                <Link href="/perfil" onClick={() => setIsOpen(false)} className="flex items-center p-3 text-[10px] font-bold tracking-widest hover:bg-black/[0.03] rounded-lg transition-colors uppercase text-black">
                  <UserCircle className="mr-3 h-4 w-4 opacity-40" /> Perfil
                </Link>
                <Link href="/ajustes" onClick={() => setIsOpen(false)} className="flex items-center p-3 text-[10px] font-bold tracking-widest hover:bg-black/[0.03] rounded-lg transition-colors uppercase text-black">
                  <Settings className="mr-3 h-4 w-4 opacity-40" /> Ajustes
                </Link>
                <Link href="/membresia" onClick={() => setIsOpen(false)} className="flex items-center p-3 text-[10px] font-bold tracking-widest hover:bg-black/[0.03] rounded-lg transition-colors uppercase text-black">
                  <CreditCard className="mr-3 h-4 w-4 opacity-40" /> Membresía
                </Link>
                <div className="h-px bg-black/5 my-2" />
                <button className="w-full flex items-center p-3 text-[10px] font-bold tracking-widest text-red-600 hover:bg-red-50 rounded-lg transition-colors uppercase">
                  <LogOut className="mr-3 h-4 w-4" /> Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
