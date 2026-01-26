"use client"

import { useState } from "react"
import { UserHeader } from "@/components/layout/user-header"
import { UserSidebar } from "@/components/layout/user-sidebar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-background">
      <UserHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      <UserSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      {/* QUITAMOS pt-32 y los contenedores max-w para que las páginas puedan ser full-width */}
      <main>
        {children}
      </main>
    </div>
  )
}
