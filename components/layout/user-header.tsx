"use client"
import { User } from "lucide-react"

interface UserHeaderProps {
  onOpenSidebar: () => void
}

export function UserHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-black/5 z-40">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        <div className="text-xl font-serif tracking-widest font-bold text-black">
          SANTUARIO
        </div>
        
        <button 
          onClick={onOpenSidebar}
          className="p-2 hover:bg-black/5 rounded-full transition-all cursor-pointer"
          aria-label="Abrir menú de usuario"
        >
          <User size={24} strokeWidth={1.2} />
        </button>
      </div>
    </header>
  )
}
