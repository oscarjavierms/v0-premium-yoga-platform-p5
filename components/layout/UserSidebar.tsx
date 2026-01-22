"use client"

import { X, LogOut, ChevronRight, Settings } from "lucide-react"
import Link from "next/link"

export function UserSidebar({ isOpen, onClose, user }: any) {
  return (
    <>
      {/* CAPA DE FONDO: Esto oscurece la web detrás para que la Sidebar destaque */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[110] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      
      {/* PANEL SIDEBAR */}
      <aside className={`fixed top-0 right-0 h-full w-[380px] bg-white z-[120] shadow-[-20px_0_50px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-10 flex flex-col h-full">
          
          <div className="flex justify-between items-start mb-16">
            <div>
              <h2 className="text-xl font-bold text-black">Mi Perfil</h2>
              <p className="text-xs text-black/40 mt-1">{user?.email || "oscarjavierms@gmail.com"}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 space-y-3">
            <Link href="/mi-santuario" onClick={onClose} className="flex justify-between items-center p-4 hover:bg-black/[0.02] rounded-xl group transition-all">
              <span className="text-lg font-light text-black">Mi Santuario</span>
              <ChevronRight size={18} className="text-black/20 group-hover:text-black transition-all" />
            </Link>
            <Link href="/mi-practica" onClick={onClose} className="flex justify-between items-center p-4 hover:bg-black/[0.02] rounded-xl group transition-all">
              <span className="text-lg font-light text-black">Mi Práctica</span>
              <ChevronRight size={18} className="text-black/20 group-hover:text-black transition-all" />
            </Link>
          </nav>

          <div className="mt-auto pt-8 border-t border-black/5 space-y-5">
            <Link href="/configuracion" className="flex items-center gap-4 text-black/50 hover:text-black transition-colors text-sm">
              <Settings size={20} strokeWidth={1.5} /> Configuración
            </Link>
            <button className="flex items-center gap-4 text-red-500 hover:text-red-700 transition-colors text-sm font-medium">
              <LogOut size={20} strokeWidth={1.5} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
