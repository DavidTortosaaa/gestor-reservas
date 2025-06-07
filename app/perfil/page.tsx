import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/ProfileForm"
import PageWrapper from "@/components/ui/PageWrapper" // 👈 Importar

export default async function PerfilPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    redirect("/login")
  }

  return (
    <PageWrapper> {/* 👈 Envolver contenido */}
      <ProfileForm />
    </PageWrapper>
  )
}
