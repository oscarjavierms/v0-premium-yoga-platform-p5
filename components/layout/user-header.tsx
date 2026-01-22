"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
    router.refresh()
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-card",
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
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm tracking-wide transition-colors duration-200",
                  pathname === item.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
              </Link>
            ))}
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
                    <p className="text-sm font-medium">
                      {user.full_name || "Usuario"}
                    </p>
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

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-muted-foreground cursor-pointer"
                  >
                    Cerrar sesión
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
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border/50">
          <div className="px-4 py-6 space-y-4">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-base text-foreground py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {user && (
              <div className="pt-4 border-t border-border/50 space-y-2">
                <Link
                  href="/mi-practica"
                  className="block text-base text-muted-foreground py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Mi Práctica
                </Link>

                <button
                  className="block w-full text-left text-base text-muted-foreground py-2"
                  onClick={async () => {
                    setIsMobileMenuOpen(false)
                    await handleLogout()
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
