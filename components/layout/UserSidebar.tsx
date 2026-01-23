"use client"
import { X, User, Settings, LogOut } from "lucide-react"

export function UserSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      <aside className={`fixed right-0 top-0 h-full w-80 bg-white z-[110] shadow-2xl transition-transform duration-500 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <button onClick={onClose} className="self-end p-2 hover:bg-black/5 rounded-full transition-all">
            <X size={24} strokeWidth={1} />
          </button>
          <div className="mt-10 mb-12 border-b border-black/5 pb-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-black/40 mb-2">Miembro Premium</p>
            <h3 className="text-3xl font-serif text-black text-left uppercase">Oscar Javier</h3>
          </div>
          <nav className="flex flex-col gap-8">
            <div className="flex items-center gap-4 text-black/70 uppercase text-xs tracking-widest font-light cursor-pointer hover:text-black">
              <User size={18} /> Mi Perfil
            </div>
            <div className="flex items-center gap-4 text-black/70 uppercase text-xs tracking-widest font-light cursor-pointer hover:text-black">
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
