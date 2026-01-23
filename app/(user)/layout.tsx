"use client"
import { useState } from "react"
import { UserHeader } from "@/components/layout/user-header"
import { UserSidebar } from "@/components/layout/user-sidebar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative min-h-screen bg-[#F9F9F9]">
      {/* Header que recibe la orden de abrir */}
      <UserHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
      
      {/* Sidebar que recibe el estado y la orden de cerrar */}
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
