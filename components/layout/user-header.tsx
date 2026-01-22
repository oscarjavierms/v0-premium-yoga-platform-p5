"use client"

import { X, Settings, CreditCard, LifeBuoy, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export function UserSidebar({ isOpen, onClose, user }: SidebarProps) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-md z-[90] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-white z-[100] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full p-12">
          <div className="flex justify-between items-start mb-16">
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-medium">Santuario Personal</p>
              <h2 className="text-4xl font-serif italic text-black leading-none lowercase">
                {user?.name || "usuario"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} strokeWidth={1} />
            </button>
          </div>

          <nav className="flex-1 space-y-10">
            <ul className="space-y-6">
              <li>
                <Link href="/mi-santuario" onClick={onClose} className="group flex items-center justify-between text-lg font-light tracking-tight hover:pl-2 transition-all">
                  <span>Mi Santuario</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>

            <div className="pt-10 border-t border-black/5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/30 mb-8">Gestión</p>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-sm font-light text-black/60 hover:text-black">
                  <Settings size={16} strokeWidth={1}/> <Link href="/cuenta">Configuración</Link>
                </li>
                <li className="flex items-center gap-4 text-sm font-light text-black/60 hover:text-black">
                  <CreditCard size={16} strokeWidth={1}/> <Link href="/membresia">Membresía</Link>
                </li>
              </ul>
            </div>
          </nav>

          <div className="mt-auto pt-10 border-t border-black/5">
            <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors">
              <LogOut size={14} strokeWidth={1} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
