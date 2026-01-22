"use client"

import { X, LogOut, User, CreditCard, History } from "lucide-react"
import Link from "next/link"

export function UserSidebar({ isOpen, onClose, user }: any) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[110] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      <aside className={`fixed top-0 right-0 h-full w-[260px] bg-white z-[120] border-l border-black/5 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <button onClick={onClose} className="self-end p-2 hover:bg-black/5 rounded-full mb-8">
            <X size={20} strokeWidth={1} />
          </button>

          <div className="mb-10">
             <p className="text-[10px] uppercase tracking-widest text-black/40 mb-1">Cuenta</p>
             <h2 className="text-sm font-bold truncate">{user?.email || "usuario@mail.com"}</h2>
          </div>

          <nav className="flex-1 space-y-2">
            <Link href="/perfil" className="flex items-center gap-3 p-3 text-sm hover:bg-black/[0.02] rounded-lg transition-all">
              <User size={16} strokeWidth={1.5} /> Perfil
            </Link>
            <Link href="/membresia" className="flex items-center gap-3 p-3 text-sm hover:bg-black/[0.02] rounded-lg transition-all">
              <CreditCard size={16} strokeWidth={1.5} /> Membresía
            </Link>
            {/* Agregamos el Historial aquí por ser algo técnico/administrativo */}
            <Link href="/historial" className="flex items-center gap-3 p-3 text-sm hover:bg-black/[0.02] rounded-lg transition-all">
              <History size={16} strokeWidth={1.5} /> Mi Historial
            </Link>
          </nav>

          <button className="mt-auto flex items-center justify-center gap-2 p-3 text-[10px] uppercase tracking-[0.2em] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  )
}
