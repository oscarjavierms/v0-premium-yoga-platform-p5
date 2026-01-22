"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User } from "lucide-react"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-[#FDFCFB] antialiased">
      {/* NAVBAR EXACTO DE TU CAPTURA */}
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-10 py-10">
        <div className="flex items-center gap-16">
          <Link href="/" className="font-serif text-2xl tracking-tighter font-black uppercase">SANTUARIO</Link>
          <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            <Link href="/yoga" className="hover:text-black transition-colors">YOGA</Link>
            <Link href="/meditacion" className="hover:text-black transition-colors">MEDITACIÓN</Link>
            <Link href="/fitness" className="hover:text-black transition-colors">FITNESS</Link>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
            <Link href="/mi-santuario" className={`${pathname === '/mi-santuario' ? 'text-black border-b-2 border-black' : 'text-gray-400'} pb-1`}>MI SANTUARIO</Link>
            <Link href="/mi-practica" className="text-gray-400 hover:text-black transition-colors">MI PRÁCTICA</Link>
          </div>
          <div className="w-10 h-10 flex items-center justify-center bg-white border border-black/5 rounded-full shadow-sm">
            <User size={18} strokeWidth={1.5} />
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
