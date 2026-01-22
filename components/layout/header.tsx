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
        isScrolled ? "bg-white/95 backdrop-blur-md border-b border-black/5" : "bg-transparent",
      )}
    >
      <nav className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo con el diseño de anoche */}
          <Link href="/" className="flex items-center">
            <span className="font-serif text-2xl tracking-tighter font-bold uppercase text-black">SANTUARIO</span>
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[10px] tracking-[0.2em] uppercase font-bold text-black/50 hover:text-black transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-x-4">
            {/* CORRECCIÓN: Ahora te lleva a mi-santuario después del login */}
            <Link href="/auth/login?callbackUrl=/mi-santuario">
              <Button variant="ghost" className="text-[10px] tracking-[0.2em] uppercase font-bold">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/auth/registro">
              <Button className="text-[10px] tracking-[0.2em] uppercase font-bold px-6 bg-black text-white rounded-full">
                Comenzar
              </Button>
            </Link>
          </div>

          <button type="button" className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
    </header>
  )
}
