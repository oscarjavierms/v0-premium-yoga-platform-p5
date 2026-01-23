"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, CreditCard, History, User, LogOut, Layout, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function UserSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Fondo oscuro cuando se abre */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/10 backdrop-blur-sm z-[9998] transition-opacity duration-500",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Menú lateral derecho */}
      <aside className={cn(
        "fixed right-0 top-0 w-80 h-screen bg-white z-[9999] shadow-[-20px_0_50px_rgba(0,0,0,0.05)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <button onClick={onClose} className="absolute top-8 left-8 p-2 text-black/20 hover:text-black transition-colors">
          <X size={20} />
        </button>

        <div className="p-12 mt-8 text-right font-serif">
          <span className="text-2xl text-black block">Santuario</span>
          <span className="text-[8px] tracking-[0.5em] uppercase font-bold text-black/20 block mt-2">Panel Privado</span>
        </div>

        <nav className="flex-1 px-8 space-y-2">
          {[
            { name: "Perfil", href: "/perfil", icon: User },
            { name: "Membresía", href: "/membresia", icon: CreditCard },
            { name: "Historial", href: "/historial", icon: History },
            { name: "Ajustes", href: "/ajustes", icon: Settings },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                "group flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-300",
                pathname === item.href ? "bg-black text-white" : "text-black/40 hover:bg-black/[0.03] hover:text-black"
              )}
            >
              <span>{item.name}</span>
              <item.icon size={14} />
            </Link>
          ))}
        </nav>

        <div className="p-10">
          <button className="w-full flex items-center justify-between px-6 py-5 border border-black/5 rounded-2xl text-[9px] tracking-[0.3em] uppercase font-bold text-red-500 hover:bg-red-50 transition-all duration-500">
            <span>Cerrar Sesión</span>
            <LogOut size={14} />
          </button>
        </div>
      </aside>
    </>
  )
}
