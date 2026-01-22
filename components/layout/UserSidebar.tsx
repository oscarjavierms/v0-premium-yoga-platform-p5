"use client"

import { X, LogOut, User, CreditCard, History, Settings } from "lucide-react"
import Link from "next/link"

export function UserSidebar({ isOpen, onClose, user }: any) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/5 backdrop-blur-[2px] z-[110] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      <aside className={`fixed top-0 right-0 h-full w-[260px] bg-white z-[120] border-l border-black/5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <button onClick={onClose} className="self-end p-2 hover:bg-black/5 rounded-full mb-8">
            <X size={20} strokeWidth={1} />
          </button>

          <nav className="flex-1 space-y-1">
            <p className="text-[9px] uppercase tracking-[0.2em] text-black/30 mb-4 px-3">Gestión de Cuenta</p>
            <Link href="/perfil" onClick={onClose} className="flex items-center gap-3 p-3 text-sm hover:bg-black/[0.02] rounded-lg">
              <User size={16} strokeWidth={1.5} /> Perfil
            </Link>
            <Link href="/membresia" onClick={onClose} className="flex items-center gap-3 p-3 text-sm hover:bg-black/[0.02] rounded-lg">
              <CreditCard size={16} strokeWidth={1.5} /> Membresía
            </Link>
            <Link href="/historial" onClick={onClose} className="flex items-center gap-3 p-3 text-sm hover:bg-black/[0.02] rounded-lg">
              <History size={16} strokeWidth={1.5} /> Historial
            </Link>
            <Link href="/configuracion" onClick={onClose} className="flex items-center gap-3 p-3 text-sm hover:bg-black/[0.02] rounded-lg">
              <Settings size={16} strokeWidth={1.5} /> Ajustes
            </Link>
          </nav>

          <button className="mt-auto flex items-center justify-center gap-2 p-3 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}
