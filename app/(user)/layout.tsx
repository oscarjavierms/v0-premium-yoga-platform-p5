"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "lucide-react"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#FDFCFB] antialiased">
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-10 py-12">
        {/* LOGO IZQUIERDA */}
        <div className="font-serif text-2xl tracking-tighter font-bold uppercase">Santuario</div>
        
        {/* MENÚ CENTRAL - Exactamente como en la foto de éxito */}
        <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400">
          <Link href="/yoga" className="hover:text-black transition-colors">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black transition-colors">Meditación</Link>
          <Link href="/fitness" className="hover:text-black transition-colors">Fitness</Link>
          <Link href="/instructores" className="hover:text-black transition-colors">Instructores</Link>
        </div>

        {/* NAVEGACIÓN DERECHA */}
        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] font-bold">
            <Link href="/mi-santuario" className={`${pathname === '/mi-santuario' ? 'text-black border-b-2 border-black' : 'text-gray-400'} pb-1`}>Mi Santuario</Link>
            <Link href="/mi-practica" className="text-gray-400 hover:text-black transition-colors">Mi Práctica</Link>
          </div>
          <button className="p-3 bg-white border border-black/5 rounded-full shadow-sm">
            <User size={20} strokeWidth={1.5} />
          </button>
        </div>
      </nav>
      {children}
    </div>
  )
}
