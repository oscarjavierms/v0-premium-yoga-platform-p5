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
    // CAMBIO A LA DERECHA (right-0) y prioridad máxima (z-[9999])
    <aside className="fixed right-0 top-0 w-72 h-screen bg-white border-l border-black/[0.03] flex flex-col z-[9999] shadow-2xl shadow-black/5">
      
      {/* Area de Logo/Branding */}
      <div className="p-10 mb-4">
        <div className="text-right"> {/* Alineado a la derecha por estética */}
          <span className="font-serif text-2xl tracking-tight text-black block">
            Santuario
          </span>
          <span className="text-[8px] tracking-[0.5em] uppercase font-semibold text-black/30 block mt-2">
            Panel Privado
          </span>
        </div>
      </div>

      {/* Navegación - Con interactividad forzada */}
      <nav className="flex-1 px-6 space-y-2 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group relative flex items-center justify-between px-5 py-4 rounded-2xl text-[10px] tracking-[0.2em] uppercase font-bold transition-all duration-500 pointer-events-auto cursor-pointer",
                isActive 
                  ? "bg-black text-white shadow-xl" 
                  : "text-black/40 hover:bg-black/[0.02] hover:text-black"
              )}
            >
              <span className="relative z-10">{item.name}</span>
              <item.icon 
                size={14} 
                className={cn(
                  "transition-transform duration-500 group-hover:scale-110", 
                  isActive ? "text-white" : "text-black/20"
                )}
              />
            </Link>
          )
        })}
      </nav>

      {/* Footer - Cerrar Sesión */}
      <div className="p-8 border-t border-black/[0.02]">
        <button 
          className="group w-full flex items-center justify-between px-6 py-4 border border-black/[0.05] rounded-2xl text-[9px] tracking-[0.3em] uppercase font-bold text-black/40 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all duration-500 pointer-events-auto cursor-pointer"
        >
          <LogOut size={13} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}
