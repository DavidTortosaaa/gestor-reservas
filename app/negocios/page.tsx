import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import NegocioCard from "@/components/NegocioCard"
import Link from "next/link"

export default async function NegociosPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect("/login")
  }
  
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  })
  
  if (!usuario) {
    redirect("/login")
  }
  
  const negocios = await prisma.negocio.findMany({
    where: {
      propietarioId: usuario.id,
    },
  })

  //Muestra los negocios del usuario
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 ">Mis Negocios</h1>

      {/* Botón para crear un nuevo negocio */}
      <Link
        href="/negocios/nuevo"
        className="inline-block mb-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
      >
        Crear nuevo negocio
      </Link>

      {/* Mostrar negocios si hay, o mensaje si no */}
      {negocios.length === 0 ? (
        <p>No has creado ningún negocio todavía.</p>
      ) : (
        <ul className="space-y-2">
           {/* Por cada negocio llama a un componente con el id y los datos del negocio*/}
          {negocios.map((negocio) => (
            <NegocioCard key={negocio.id} negocio={negocio} />
          ))}
      </ul>
      )}
    </div>
  )
}
