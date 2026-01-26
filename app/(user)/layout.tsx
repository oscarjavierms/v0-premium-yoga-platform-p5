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
      
      {/* Añadimos un margen lateral (px-8 y lg:px-20) para que respire */}
      <main className="pt-32 px-8 lg:px-20">
        <div className="max-w-[1440px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
