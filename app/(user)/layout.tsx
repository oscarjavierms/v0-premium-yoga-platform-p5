"use client"
import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, CreditCard, History, Settings, LogOut, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const menuItems = [
    { name: "Mi Santuario", href: "/mi-santuario", icon: Heart },
    { name: "Perfil", href: "/perfil", icon: User },
    { name: "Membresía", href: "/membresia", icon: CreditCard },
    { name: "Historial", href: "/historial", icon: History },
    { name: "Ajustes", href: "/ajustes", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-[#FDFCFB]">
      {/* SIDEBAR FIJO */}
      <aside className="w-64 border-r border-black/5 bg-white flex flex-col">
        <div className="p-8">
          <span className="font-serif text-xl italic tracking-tight">Tu Academia</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors ${
                  isActive 
                    ? "bg-[#1a1a1a] text-white" 
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-black/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO VARIABLE */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
