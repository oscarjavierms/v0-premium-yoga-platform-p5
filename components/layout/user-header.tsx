"use client"
import Link from "next/link"
import { User } from "lucide-react"

export function UserHeader() {
  return (
    <header className="fixed top-0 w-full z-[100] bg-white border-b border-black/5 h-20">
      <div className="max-w-[1400px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tighter text-black uppercase font-serif">
          Santuario
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-black/50">
          <Link href="/yoga" className="hover:text-black transition-colors">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black transition-colors">Meditación</Link>
          <Link href="/fitness" className="hover:text-black transition-colors">Fitness</Link>
          <Link href="/instructores" className="hover:text-black transition-colors">Instructores</Link>
          
          <div className="w-[1px] h-4 bg-black/10 mx-2" />
          
          <Link href="/mi-santuario" className="text-black hover:opacity-60 transition-opacity font-bold underline underline-offset-8 decoration-2">
            Mi Santuario
          </Link>
          <Link href="/mi-practica" className="text-black hover:opacity-60 transition-opacity font-bold">
            Mi Práctica
          </Link>
        </nav>

        <button className="w-10 h-10 flex items-center justify-center bg-white border border-black/5 rounded-full shadow-sm">
          <User size={18} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
