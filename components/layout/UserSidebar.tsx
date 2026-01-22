"use client"

import { X, LogOut, ChevronRight, Settings, CreditCard } from "lucide-react"
import Link from "next/link"

export function UserSidebar({ isOpen, onClose, user }: any) {
  return (
    <>
      <div className={`fixed inset-0 bg-black/5 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <aside className={`fixed top-0 right-0 h-full w-[350px] bg-white z-[110] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full p-12">
          
          <div className="flex justify-between items-start mb-20">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/30">Bienvenido</p>
              <h2 className="text-3xl font-serif italic text-black">{user?.name || "Practicante"}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full"><X size={20} strokeWidth={1}/></button>
          </div>

          <nav className="flex-1 space-y-12">
            <ul className="space-y-8">
              {/* AQUÍ ESTÁ LA COHERENCIA QUE BUSCAMOS */}
              <li>
                <Link href="/dashboard" onClick={onClose} className="group flex justify-between items-center text-xl font-light tracking-tight hover:translate-x-2 transition-transform">
                  <span>Mi Santuario</span>
                  <ChevronRight size={14} className="opacity-20 group-hover:opacity-100" />
                </Link>
              </li>
              <li>
                <Link href="/practica" onClick={onClose} className="group flex justify-between items-center text-xl font-light tracking-tight hover:translate-x-2 transition-transform">
                  <span>Mi Práctica</span>
                  <ChevronRight size={14} className="opacity-20 group-hover:opacity-100" />
                </Link>
              </li>
            </ul>

            <div className="pt-12 border-t border-black/5 space-y-6">
               <Link href="/mi-cuenta" className="flex items-center gap-4 text-sm font-light text-black/50 hover:text-black transition-colors">
                  <Settings size={16} strokeWidth={1} /> Configuración
               </Link>
               <Link href="/membresia" className="flex items-center gap-4 text-sm font-light text-black/50 hover:text-black transition-colors">
                  <CreditCard size={16} strokeWidth={1} /> Membresía
               </Link>
            </div>
          </nav>

          <div className="mt-auto pt-8 border-t border-black/5">
            <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors">
              <LogOut size={16} strokeWidth={1} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
