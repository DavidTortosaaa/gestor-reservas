// app/perfil/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mi Perfil</h1>
      <p className="text-gray-700">Bienvenido, {session.user?.email}</p>
    </div>
  )
}