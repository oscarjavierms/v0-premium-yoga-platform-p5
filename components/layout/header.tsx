"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Método", href: "#metodo" },
  { name: "Clases", href: "#clases" },
  { name: "Profesores", href: "#profesores" },
  { name: "Membresía", href: "#membresia" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border" : "bg-transparent",
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-2xl tracking-tight">TU ACADEMIA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm tracking-wide uppercase text-foreground/70 hover:text-foreground transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-sm tracking-wide uppercase">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/registro">
              <Button className="text-sm tracking-wide uppercase px-6">Comenzar</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button type="button" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-b border-border">
          <div className="px-6 py-8 space-y-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-lg tracking-wide text-foreground/70 hover:text-foreground"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-6 border-t border-border space-y-4">
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full tracking-wide uppercase bg-transparent">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/auth/registro" className="block">
                <Button className="w-full tracking-wide uppercase">Comenzar</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
