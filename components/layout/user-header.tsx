"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, LogOut, Settings, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
// Importamos los componentes del menú pequeño
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserHeader() {
  const pathname = usePathname()

  const navItems = [
    { name: "YOGA", href: "/yoga" },
    { name: "MEDITACIÓN", href: "/meditacion" },
    { name: "FITNESS", href: "/fitness" },
    { name: "INSTRUCTORES", href: "/instructores" },
  ]

  const secondaryItems = [
    { name: "MI SANTUARIO", href: "/mi-santuario" },
    { name: "MI PRÁCTICA", href: "/mi-practica" },
  ]

  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-black/[0.05] z-[100]">
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
        {/* Logo */}
        <Link href="/mi-santuario" className="font-serif text-xl text-black hover:text-black/60 transition-colors">
          SANTUARIO
        </Link>

        {/* Navigation */}
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
          
          <div className="w-px h-4 bg-black/10" />
          
          {secondaryItems.map((item) => (
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

        {/* --- AQUÍ ESTÁ EL CAMBIO: Quitamos el botón viejo y ponemos el Dropdown --- */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="p-3 rounded-full border border-black/5 hover:bg-black/5 transition-all outline-none flex items-center justify-center bg-white shadow-sm hover:shadow-md">
              <User size={20} strokeWidth={1.5} className="text-black/70" />
            </button>
          </DropdownMenuTrigger>

          {/* El menú flota sin oscurecer ni desenfocar la foto de Yoga */}
          <DropdownMenuContent align="end" className="w-56 mt-2 bg-white border border-black/5 p-2 shadow-xl">
            <DropdownMenuLabel className="text-[10px] tracking-widest text-black/40 font-bold uppercase p-2">
              Mi Perfil
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-black/5" />
            
            <DropdownMenuItem asChild>
              <Link href="/perfil" className="flex items-center p-2 text-xs font-medium cursor-pointer hover:bg-black/[0.03] rounded-md transition-colors">
                <Settings className="mr-2 h-4 w-4 opacity-50" />
                <span>AJUSTES</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/mi-practica" className="flex items-center p-2 text-xs font-medium cursor-pointer hover:bg-black/[0.03] rounded-md transition-colors">
                <Heart className="mr-2 h-4 w-4 opacity-50" />
                <span>FAVORITOS</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-black/5" />
            
            <DropdownMenuItem className="flex items-center p-2 text-xs font-medium cursor-pointer text-red-600 hover:bg-red-50 rounded-md transition-colors">
              <LogOut className="mr-2 h-4 w-4" />
              <span>CERRAR SESIÓN</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
