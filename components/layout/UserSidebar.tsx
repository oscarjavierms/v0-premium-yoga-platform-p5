"use client"

import { X, LogOut, ChevronRight } from "lucide-react"
import Link from "next/link"

export function UserSidebar({ isOpen, onClose, user }: any) {
  return (
    <>
      {/* Fondo oscuro al abrir */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-[100]" onClick={onClose} />
      )}
      
      <aside className={`fixed top-0 right-0 h-full w-80 bg-white z-[110] shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-bold">Mi Cuenta</h2>
            <button onClick={onClose}><X size={20}/></button>
          </div>

          <nav className="space-y-4">
            {/* Lógica: Home del usuario */}
            <Link href="/mi-santuario" onClick={onClose} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span>Mi Santuario</span>
              <ChevronRight size={16} />
            </Link>
            
            {/* Lógica: Clases guardadas */}
            <Link href="/mi-practica" onClick={onClose} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
              <span>Mi Práctica</span>
              <ChevronRight size={16} />
            </Link>
          </nav>

          <div className="mt-auto border-t pt-4">
            <button className="flex items-center gap-2 text-red-600">
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
