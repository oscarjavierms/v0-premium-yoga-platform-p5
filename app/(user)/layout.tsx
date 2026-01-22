import { UserHeader } from "@/components/layout/user-header"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* El header del commit de anoche */}
      <UserHeader /> 
      <main>
        {children}
      </main>
    </div>
  )
}
