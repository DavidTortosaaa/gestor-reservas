import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import NuevoNegocioForm from "@/components/NuevoNegocioForm"
import PageWrapper from "@/components/ui/PageWrapper" // 👈

export default async function CrearNegocioPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    redirect("/login")
  }

  return (
    <PageWrapper>
      <NuevoNegocioForm />
    </PageWrapper>
  )
}
