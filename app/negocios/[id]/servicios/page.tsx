import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import Link from "next/link"
import ServicioCard from "@/components/ServicioCard"
import PageWrapper from "@/components/ui/PageWrapper"

type PageProps = {
  params: {
    id: string
  }
}

export default async function ServiciosPage({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }

  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
      propietario: { email: session.user.email },
    },
    include: { servicios: true },
  })

  if (!negocio) {
    redirect("/negocios")
  }

  return (
    <PageWrapper>
      <h1 className="text-2xl font-bold mb-4 text-white">Servicios de {negocio.nombre}</h1>

      <Link
        href={`/negocios/${negocio.id}/servicios/nuevo`}
        className="inline-block mb-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 shadow"
      >
        +Crear nuevo servicio
      </Link>

      {negocio.servicios.length === 0 ? (
        <p className="text-white">No has creado ningún servicio todavía.</p>
      ) : (
        <ul className="space-y-3">
          {negocio.servicios.map((servicio) => (
            <ServicioCard
              key={servicio.id}
              servicio={{ ...servicio, negocioId: negocio.id }}
            />
          ))}
        </ul>
      )}
    </PageWrapper>
  )
}
