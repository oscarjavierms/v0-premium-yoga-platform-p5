"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// Importamos la nueva Sidebar que vas a crear
import { UserSidebar } from "./UserSidebar" 

const navLinks = [
  { name: "Yoga", href: "/yoga" },
  { name: "Meditación", href: "/meditacion" },
  { name: "Fitness", href: "/fitness" },
  { name: "Instructores", href: "/instructores" },
  { name: "Mi Santuario", href: "/mi-santuario" },
]

interface UserHeaderProps {
  user?: {
    full_name?: string
    email?: string
    avatar_url?: string
  } | null
}

export function UserHeader({ user }: UserHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Nuevo estado para la Sidebar de Lujo
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-black/5"
            : "bg-white"
        )}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/mi-santuario" className="flex items-center shrink-0">
              <div className="w-8 h-8 rounded-full border border-black flex items-center justify-center hover:scale-105 transition-transform">
                <span className="font-serif text-sm italic">s</span>
              </div>
            </Link>

            {/* Navegación Central - Desktop (Limpia) */}
            <div className="hidden md:flex md:items-center md:gap-x-10">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-[10px] uppercase tracking-[0.2em] transition-colors duration-200",
                    pathname === item.href
                      ? "text-black font-semibold"
                      : "text-black/40 hover:text-black"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Sección Derecha */}
            <div className="flex items-center gap-x-4">
              <Button variant="ghost" size="icon" className="hidden md:flex hover:bg-transparent">
                <Search className="h-4 w-4 stroke-[1.5px]" />
              </Button>

              {user ? (
                /* FOTO DE PERFIL: Ahora abre la Sidebar de Lujo al hacer clic */
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="relative h-8 w-8 rounded-full overflow-hidden border border-black/5 hover:scale-110 transition-transform"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name || "Usuario"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black text-[10px] text-white font-light">
                      {getInitials(user.full_name)}
                    </div>
                  )}
                </button>
              ) : (
                <Link href="/auth/login" className="text-[10px] uppercase tracking-widest font-medium">
                  Entrar
                </Link>
              )}

              {/* Menú Móvil */}
              <button
                type="button"
                className="md:hidden p-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* COMPONENTE SIDEBAR: Aparece cuando isSidebarOpen es true */}
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={{
          name: user?.full_name,
          email: user?.email
        }} 
      />
    </>
  )
}
