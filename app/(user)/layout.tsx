import React from "react"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFCFB] selection:bg-black/5">
      {children}
    </div>
  )
}
