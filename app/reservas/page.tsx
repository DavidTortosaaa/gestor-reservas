import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import NegocioPublicoCard from "@/components/NegocioPublicoCard"

export default async function ReservasPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const negocios = await prisma.negocio.findMany()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reservar un Servicio</h1>
      <p className="mb-4">Selecciona un negocio para ver sus servicios disponibles:</p>

      {negocios.length === 0 ? (
        <p>No hay negocios disponibles en este momento.</p>
      ) : (
        <ul className="space-y-4">
          {negocios.map((negocio) => (
            <NegocioPublicoCard key={negocio.id} negocio={negocio} />
          ))}
        </ul>
      )}
    </div>
  )
}//estilo