import { UserHeader } from "@/components/layout/user-header"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Este componente contiene el diseño exacto de tu commit de anoche */}
      <UserHeader /> 
      <main className="pt-20">
        {children}
      </main>
    </div>
  )
}
