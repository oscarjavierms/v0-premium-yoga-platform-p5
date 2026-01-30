"use client"
import { useState } from "react"
import { UserHeader } from "@/components/layout/user-header"
import { UserSidebar } from "@/components/layout/user-sidebar"
// import { PaywallGuard } from "@/components/paywall/paywall-guard"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    // <PaywallGuard>
      <div className="relative min-h-screen bg-background">
        <UserHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        
        <UserSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <main className="pt-32 px-8 lg:px-20">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    // </PaywallGuard>
  )
}
```

---

## 📍 EN GITHUB

1. Ve a `app/(user)/layout.tsx`
2. Click **lápiz** ✏️
3. **Borra TODO**
4. **Pega** el código de arriba
5. Mensaje: `temp: disable paywall guard for testing`
6. Click **"Commit changes"**

---

## ⏳ ESPERA 10 SEGUNDOS

Vercel está desplegando.

---

## 🎯 LUEGO

Intenta:
```
https://v0-premium-yoga-platform.vercel.app/mi-santuario
