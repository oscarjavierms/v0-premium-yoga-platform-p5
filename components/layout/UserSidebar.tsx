"use client"
import { X, User, Settings, LogOut } from "lucide-react"

interface UserSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      <aside className={`fixed right-0 top-0 h-full w-80 bg-white z-[110] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <button onClick={onClose} className="self-end p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
          <div className="mt-8">
            <h3 className="text-2xl font-serif">Oscar Javier</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Miembro Premium</p>
          </div>
          <nav className="mt-12 flex flex-col gap-6">
            <div className="flex items-center gap-4 text-sm tracking-widest uppercase font-light cursor-pointer"><User size={18}/> Perfil</div>
            <div className="flex items-center gap-4 text-sm tracking-widest uppercase font-light cursor-pointer"><Settings size={18}/> Ajustes</div>
          </nav>
          <button className="mt-auto flex items-center gap-4 text-red-500 text-sm tracking-widest uppercase font-light">
            <LogOut size={18}/> Salir
          </button>
        </div>
      </aside>
    </>
  )
}
