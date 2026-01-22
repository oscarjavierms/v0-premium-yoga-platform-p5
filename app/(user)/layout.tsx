import { Navbar } from "@/components/navigation/navbar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      <Navbar /> 
      {children}
    </div>
  )
}
