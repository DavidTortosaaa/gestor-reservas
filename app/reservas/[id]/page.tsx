import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import ServicioPublicoCard from "@/components/ServicioPublicoCard"

type PageProps = {
  params: {
    id: string // ID del negocio
  }
}

export default async function ServiciosDelNegocio({ params }: PageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const negocio = await prisma.negocio.findUnique({
    where: { id: params.id },
    include: {
      servicios: true,
    },
  })

  if (!negocio) {
    redirect("/reservas") // Volver si no existe
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ">Servicios de {negocio.nombre}</h1>
      <p className="mb-6">{negocio.direccion}</p>

      {negocio.servicios.length === 0 ? (
        <p>Este negocio no tiene servicios disponibles por ahora.</p>
      ) : (
        <ul className="space-y-4">
          {negocio.servicios.map((servicio) => (
            <ServicioPublicoCard
              key={servicio.id}
              servicio={servicio}
              negocio={negocio}
            />
          ))}
        </ul>
      )}
    </div>
  )
}