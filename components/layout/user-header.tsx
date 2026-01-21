"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { name: "Yoga", href: "/yoga" },
  { name: "Meditación", href: "/meditacion" },
  { name: "Fitness", href: "/fitness" },
  { name: "Instructores", href: "/instructores" },
  { name: "Mi Santuario", href: "/mi-santuario" },
]

interface UserHeaderProps {
  user?: {
    full_name?: string
    email?: string
    avatar_url?: string
  } | null
}

export function UserHeader({ user }: UserHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
