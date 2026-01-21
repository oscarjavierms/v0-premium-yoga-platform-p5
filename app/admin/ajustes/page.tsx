import { AjustesClient } from "./ajustes-client"

export const metadata = {
  title: "Ajustes | Admin",
}

export default function AdminAjustesPage() {
  return (
    <div className="p-4 lg:p-8">
      <AjustesClient />
    </div>
  )
}
