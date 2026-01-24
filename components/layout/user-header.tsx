"use client"



import Link from "next/link"

import { usePathname } from "next/navigation"

import { User } from "lucide-react"

import { cn } from "@/lib/utils"



export function UserHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {

  const pathname = usePathname()



  const navItems = [

    { name: "YOGA", href: "/yoga" },

    { name: "MEDITACIÓN", href: "/meditacion" },

    { name: "FITNESS", href: "/fitness" },

    { name: "INSTRUCTORES", href: "/instructores" },

  ]



  const secondaryItems = [

    { name: "MI SANTUARIO", href: "/mi-santuario" },

    { name: "MI PRÁCTICA", href: "/mi-practica" },

  ]



  return (

    /* CAMBIO CLAVE: bg-white sólido y z-index alto */

    <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-black/[0.05] z-[100]">

      <div className="max-w-7xl mx-auto h-full px-6 flex justify-between items-center">

        {/* Logo */}

        <Link href="/mi-santuario" className="font-serif text-xl text-black hover:text-black/60 transition-colors">

          SANTUARIO

        </Link>



        {/* Navigation */}

        <nav className="hidden md:flex items-center gap-8">

          {navItems.map((item) => (

            <Link

              key={item.href}

              href={item.href}

              className={cn(

                "text-[10px] tracking-[0.2em] font-bold transition-colors",

                pathname === item.href ? "text-black" : "text-black/40 hover:text-black/70"

              )}

            >

              {item.name}

            </Link>

          ))}

          

          <div className="w-px h-4 bg-black/10" />

          

          {secondaryItems.map((item) => (

            <Link

              key={item.href}

              href={item.href}

              className={cn(

                "text-[10px] tracking-[0.2em] font-bold transition-colors",

                pathname === item.href ? "text-black" : "text-black/40 hover:text-black/70"

              )}

            >

              {item.name}

            </Link>

          ))}

        </nav>



        {/* User button */}

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
