"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "lucide-react"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* EL MENÚ (Navbar) */}
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-10 py-10">
        <Link href="/" className="font-serif text-2xl tracking-tighter font-black uppercase">Santuario</Link>
        
        <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400">
          <Link href="/yoga" className="hover:text-black">Yoga</Link>
          <Link href="/meditacion" className="hover:text-black">Meditación</Link>
          <Link href="/fitness" className="hover:text-black">Fitness</Link>
          <Link href="/instructores" className="hover:text-black">Instructores</Link>
        </div>

        <div className="flex items-center gap-10">
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.25em] font-bold">
            <Link href="/mi-santuario" className={`${pathname === '/mi-santuario' ? 'text-black border-b-2 border-black' : 'text-gray-400'} pb-1`}>Mi Santuario</Link>
            <Link href="/mi-practica" className={`${pathname === '/mi-practica' ? 'text-black border-b-2 border-black' : 'text-gray-400'} pb-1`}>Mi Práctica</Link>
          </div>
          <div className="w-12 h-12 flex items-center justify-center bg-white border border-black/5 rounded-full shadow-sm">
            <User size={20} strokeWidth={1.5} />
          </div>
        </div>
      </nav>

      {/* AQUÍ SE CARGAN LAS PÁGINAS (Yoga, Mi Santuario, etc.) */}
      {children}
    </div>
  )
}
