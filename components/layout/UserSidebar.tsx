"use client"
import { X, User, Settings, CreditCard, LogOut, ChevronRight } from "lucide-react"

interface UserSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      <aside className={`fixed right-0 top-0 h-full w-80 bg-white z-[110] shadow-2xl transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <button onClick={onClose} className="self-end p-2 hover:bg-black/5 rounded-full transition-all">
            <X size={24} strokeWidth={1} />
          </button>
          <div className="mt-10 mb-12 border-b border-black/5 pb-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">Usuario Premium</p>
            <h3 className="text-3xl font-serif text-black">Oscar Javier</h3>
          </div>
          <nav className="flex flex-col gap-8">
            <div className="flex items-center gap-4 text-black/70 hover:text-black cursor-pointer uppercase text-xs tracking-widest font-light">
              <User size={18} /> Mi Perfil
            </div>
            <div className="flex items-center gap-4 text-black/70 hover:text-black cursor-pointer uppercase text-xs tracking-widest font-light">
              <CreditCard size={18} /> Membresía
            </div>
            <div className="flex items-center gap-4 text-black/70 hover:text-black cursor-pointer uppercase text-xs tracking-widest font-light">
              <Settings size={18} /> Ajustes
            </div>
          </nav>
          <div className="mt-auto pt-8 border-t border-black/5">
            <button className="flex items-center gap-4 text-red-400 hover:text-red-600 transition-colors w-full group">
              <LogOut size={18} strokeWidth={1.5} />
              <span className="text-sm tracking-wide font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
