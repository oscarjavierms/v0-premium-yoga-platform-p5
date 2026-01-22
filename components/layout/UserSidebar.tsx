"use client"

import { X, LogOut, ChevronRight, Bookmark, Settings } from "lucide-react"
import Link from "next/link"

export function UserSidebar({ isOpen, onClose, user }: any) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-[100] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose} 
      />
      <aside className={`fixed top-0 right-0 h-full w-80 bg-white z-[110] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="font-bold text-lg">Mi Perfil</h2>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={20}/></button>
          </div>

          <nav className="flex-1 space-y-2">
            <Link href="/mi-santuario" onClick={onClose} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg group">
              <span className="font-medium">Mi Santuario</span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-black" />
            </Link>
            <Link href="/mi-practica" onClick={onClose} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg group">
              <span className="font-medium">Mi Práctica</span>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-black" />
            </Link>
          </nav>

          <div className="mt-auto border-t pt-6 space-y-4">
            <Link href="/configuracion" className="flex items-center gap-3 text-sm text-gray-500 hover:text-black transition-colors">
              <Settings size={18} /> Configuración
            </Link>
            <button className="flex items-center gap-3 text-sm text-red-500 hover:text-red-700 transition-colors">
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
