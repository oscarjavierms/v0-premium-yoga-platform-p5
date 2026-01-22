"use client"

import { X, Settings, CreditCard, LogOut, ChevronRight, User, Heart } from "lucide-react"
import Link from "next/link"

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name?: string;
    email?: string;
  };
}

export function UserSidebar({ isOpen, onClose, user }: SidebarProps) {
  return (
    <>
      {/* Fondo desenfocado */}
      <div 
        className={`fixed inset-0 bg-black/5 backdrop-blur-md z-[100] transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel Lateral */}
      <aside 
        className={`fixed top-0 right-0 h-full w-full max-w-[350px] bg-white z-[110] shadow-2xl transition-transform duration-500 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-10">
          
          {/* Perfil */}
          <div className="flex justify-between items-start mb-16">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/30 font-medium font-sans">Santuario</p>
              <h2 className="text-3xl font-serif italic text-black leading-none lowercase">
                {user?.name || "usuario"}
              </h2>
              <p className="text-[10px] text-black/40 font-light font-sans">{user?.email}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
              <X size={20} strokeWidth={1} />
            </button>
          </div>

          {/* Navegación - Aquí es donde unimos "Mi Santuario" y "Mi Práctica" con estilo */}
          <nav className="flex-1 space-y-12">
            <div className="space-y-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/30 font-sans">Explorar</p>
              <ul className="space-y-6">
                <li>
                  <Link href="/mi-santuario" onClick={onClose} className="group flex items-center justify-between text-lg font-light tracking-tight hover:translate-x-1 transition-transform">
                    <span>Mi Santuario</span>
                    <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
                <li>
                  <Link href="/mi-practica" onClick={onClose} className="group flex items-center justify-between text-lg font-light tracking-tight hover:translate-x-1 transition-transform">
                    <span>Mi Práctica</span>
                    <ChevronRight size={14} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              </ul>
            </div>

            <div className="pt-10 border-t border-black/5">
              <p className="text-[10px] uppercase tracking-[0.3em] text-black/30 mb-8 font-sans">Cuenta</p>
              <ul className="space-y-6">
                <li>
                  <Link href="/mi-cuenta" onClick={onClose} className="flex items-center gap-4 text-sm font-light text-black/60 hover:text-black transition-colors">
                    <Settings size={16} strokeWidth={1}/> 
                    <span>Configuración</span>
                  </Link>
                </li>
                <li>
                  <Link href="/membresia" onClick={onClose} className="flex items-center gap-4 text-sm font-light text-black/60 hover:text-black transition-colors">
                    <CreditCard size={16} strokeWidth={1}/> 
                    <span>Membresía</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

          {/* Botón Salir */}
          <div className="mt-auto pt-10 border-t border-black/5">
            <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-black/40 hover:text-red-500 transition-colors group">
              <LogOut size={16} strokeWidth={1} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
