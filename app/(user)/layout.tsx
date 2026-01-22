import { UserHeader } from "@/components/layout/user-header"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <UserHeader /> 
      <main className="pt-20"> {/* El padding superior evita que el menú tape el contenido */}
        {children}
      </main>
    </div>
  )
}
