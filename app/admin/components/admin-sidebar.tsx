"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Video,
  BookOpen,
  Users,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  Play,
  BarChart3,
  Menu,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clases", label: "Clases", icon: Video },
  { href: "/admin/programas", label: "Programas", icon: BookOpen },
  { href: "/admin/instructores", label: "Profesores", icon: UserCircle },
  { href: "/admin/videos", label: "Videos (Vimeo)", icon: Play },
  { href: "/admin/usuarios", label: "Usuarios", icon: Users },
  { href: "/admin/metricas", label: "Métricas", icon: BarChart3 },
  { href: "/admin/ajustes", label: "Ajustes", icon: Settings },
]

function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-background/10">
        <Link href="/admin" className="font-serif text-xl font-medium" onClick={onLinkClick}>
          Admin Panel
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-background text-foreground"
                      : "text-background/70 hover:text-background hover:bg-background/10",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-background/10 space-y-2">
        <Link
          href="/dashboard"
          onClick={onLinkClick}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-background/70 hover:text-background hover:bg-background/10 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver al sitio
        </Link>
        <form action="/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-background/70 hover:text-background hover:bg-background/10 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  )
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-foreground text-background flex-col min-h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 bg-foreground text-background border-none">
            <div className="flex flex-col h-full">
              <SidebarContent onLinkClick={() => setOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
