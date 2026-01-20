"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = [
  { name: "Yoga", href: "/explorar?categoria=yoga" },
  { name: "Meditación", href: "/explorar?categoria=meditacion" },
  { name: "Fitness", href: "/explorar?categoria=fitness" },
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
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-background/98 backdrop-blur-sm border-b border-border/50" 
          : "bg-background"
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/mi-santuario" className="flex items-center shrink-0">
            <div className="w-8 h-8 rounded-full border border-foreground flex items-center justify-center">
              <span className="font-serif text-sm">e</span>
            </div>
          </Link>

          {/* Center Navigation - Desktop */}
          <div className="hidden md:flex md:items-center md:gap-x-8">
            {categories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm tracking-wide transition-colors duration-200",
                  pathname.includes(item.name.toLowerCase())
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                Más <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="/programas">Programas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/instructores">Instructores</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-x-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-4 w-4" />
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {user.avatar_url ? (
                      <img 
                        src={user.avatar_url || "/placeholder.svg"} 
                        alt={user.full_name || "Usuario"} 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-medium">
                        {getInitials(user.full_name)}
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.full_name || "Usuario"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/mi-santuario">Mi Santuario</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mi-practica">Mi Práctica</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/mi-cuenta">Configuración</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/logout" className="text-muted-foreground">
                      Cerrar sesión
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth/login">
                <Button size="sm" className="rounded-full px-4">
                  Sign In
                </Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <button 
              type="button" 
              className="md:hidden p-2" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/50">
          <div className="px-4 py-6 space-y-4">
            {categories.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-base text-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border/50 space-y-2">
              <Link
                href="/programas"
                className="block text-base text-muted-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Programas
              </Link>
              <Link
                href="/instructores"
                className="block text-base text-muted-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Instructores
              </Link>
            </div>
            {user && (
              <div className="pt-4 border-t border-border/50 space-y-2">
                <Link
                  href="/mi-santuario"
                  className="block text-base font-medium text-foreground py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mi Santuario
                </Link>
                <Link
                  href="/mi-practica"
                  className="block text-base text-muted-foreground py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mi Práctica
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
