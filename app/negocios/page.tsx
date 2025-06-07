import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import NegocioCard from "@/components/NegocioCard"
import Link from "next/link"
import PageWrapper from "@/components/ui/PageWrapper" // 👈 Importa el wrapper

export default async function NegociosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) redirect("/login")

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  })

  if (!usuario) redirect("/login")

  const negocios = await prisma.negocio.findMany({
    where: { propietarioId: usuario.id },
  })

  return (
    <PageWrapper> {/* 👈 Aplicar envoltorio */}
      <h1 className="text-3xl font-bold mb-6 text-white">Mis Negocios</h1>

      <Link
        href="/negocios/nuevo"
        className="inline-block mb-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        + Crear nuevo negocio
      </Link>

      {negocios.length === 0 ? (
        <p className="text-white">No has creado ningún negocio todavía.</p>
      ) : (
        <ul className="space-y-4">
          {negocios.map((negocio) => (
            <NegocioCard key={negocio.id} negocio={negocio} />
          ))}
        </ul>
      )}
    </PageWrapper>
  )
}
