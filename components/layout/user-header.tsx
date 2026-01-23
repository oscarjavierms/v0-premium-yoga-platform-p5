"use client"

import { User } from "lucide-react"

export function UserHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-b border-black/[0.03] z-[100]">
      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">
        {/* Espacio para tu logo a la izquierda */}
        <div className="font-serif text-xl">SANTUARIO</div>

        {/* Botón de usuario a la derecha */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            onOpenSidebar();
          }}
          className="p-3 rounded-full border border-black/5 hover:bg-black/5 transition-all cursor-pointer pointer-events-auto flex items-center justify-center bg-white shadow-sm hover:shadow-md"
        >
          <User size={20} strokeWidth={1.5} className="text-black/70" />
        </button>
      </div>
    </header>
  )
}
