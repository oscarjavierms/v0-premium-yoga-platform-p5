"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Settings, CreditCard, History, User, LogOut, Layout } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Mi Santuario", href: "/mi-santuario", icon: Layout },
  { name: "Perfil", href: "/perfil", icon: User },
  { name: "Membresía", href: "/membresia", icon: CreditCard },
  { name: "Historial", href: "/historial", icon: History },
  { name: "Ajustes", href: "/ajustes", icon: Settings },
]

export function UserSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-white border-r border-black/[0.03] flex flex-col z-[100]">
      {/* Branding Area */}
      <div className="p-10 mb-4">
        <Link href="/mi-santuario" className="group block pointer-events-auto">
          <span className="font-serif text-2xl tracking-tight text-black block">
            Santuario
          </span>
          <div className="flex items-center gap-2 mt-2">
            <span className="h-[1px] w-4 bg-black/10"></span>
            <span className="text-[8px] tracking-[0.5em] uppercase font-semibold text-black/30">
              Private Space
            </span>
          </div>
        </Link>
      </div>

      {/* Navegación - Botones con Interactividad Forzada */}
      <nav className="flex-1 px-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-500 z-50 pointer-events-auto",
                isActive 
                  ? "bg-black text-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)]" 
                  : "text-black/40 hover:bg-black/[0.02] hover:text-black"
              )}
            >
              <item.icon 
                size={14} 
                className={cn(
                  "transition-transform duration-500 group-hover:scale-110", 
                  isActive ? "text-white" : "text-black/20"
                )}
              />
              <span className="relative z-10">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer - Botón Cerrar Sesión */}
      <div className="p-8 border-t border-black/[0.02]">
        <button 
          className="group w-full flex items-center justify-between px-6 py-4 border border-black/[0.05] rounded-2xl text-[9px] tracking-[0.3em] uppercase font-bold text-black/40 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all duration-500 pointer-events-auto cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <LogOut size={13} />
            <span>Cerrar Sesión</span>
          </div>
        </button>
      </div>
    </aside>
  )
}
