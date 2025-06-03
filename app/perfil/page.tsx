// app/perfil/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/ProfileForm"


export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      <ProfileForm />
    </div>
  )
}