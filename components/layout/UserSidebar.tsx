"use client"

import { X, LogOut, User, CreditCard, Settings } from "lucide-react"
import Link from "next/link"

export function UserSidebar({ isOpen, onClose, user }: any) {
  return (
    <>
      {/* Overlay más sutil */}
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-[1px] z-[110] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      {/* Sidebar reducida a 280px */}
      <aside className={`fixed top-0 right-0 h-full w-[280px] bg-white z-[120] border-l border-black/5 shadow-xl transition-transform duration-400 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          
          <div className="flex justify-end mb-8">
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mb-10 text-center">
             <div className="w-16 h-16 bg-gray-50 border border-black/5 rounded-full mx-auto mb-4 flex items-center justify-center">
                <User size={24} strokeWidth={1} className="text-black/20" />
             </div>
             <h2 className="text-sm font-bold text-black truncate">{user?.full_name || "Mi Cuenta"}</h2>
             <p className="text-[10px] text-black/40 uppercase tracking-tighter mt-1">{user?.email}</p>
          </div>

          <nav className="flex-1 space-y-1">
            <Link href="/perfil" className="flex items-center gap-3 p-3 text-sm text-black/70 hover:text-black hover:bg-black/[0.02] rounded-lg transition-all">
              <User size={16} strokeWidth={1.5} /> Perfil
            </Link>
            <Link href="/membresia" className="flex items-center gap-3 p-3 text-sm text-black/70 hover:text-black hover:bg-black/[0.02] rounded-lg transition-all">
              <CreditCard size={16} strokeWidth={1.5} /> Membresía
            </Link>
            <Link href="/configuracion" className="flex items-center gap-3 p-3 text-sm text-black/70 hover:text-black hover:bg-black/[0.02] rounded-lg transition-all">
              <Settings size={16} strokeWidth={1.5} /> Configuración
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-black/5">
            <button className="w-full flex items-center justify-center gap-2 p-3 text-[11px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 transition-colors rounded-lg">
              <LogOut size={14} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
