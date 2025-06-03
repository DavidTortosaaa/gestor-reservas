import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Building, CalendarCheck, Search, Plus } from "lucide-react"

export default async function Home() {
  const session = await getServerSession(authOptions)

  let nombreUsuario = ""
  if (session?.user?.email) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    })

    if (usuario) {
      nombreUsuario = usuario.nombre
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 text-black">
      {/* Hero */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-2">
          Gestor de Reservas
        </h1>
        <p className="text-gray-600 text-lg">
          Organiza tu negocio. Simplifica tus reservas.
        </p>
        {nombreUsuario && (
          <p className="mt-4 text-lg text-white">
            👋 Bienvenido, <span className="font-semibold text-white">{nombreUsuario}</span>
          </p>
        )}
      </section>

      {/* Acciones rápidas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Link
          href="/negocios/nuevo"
          className="flex flex-col items-center p-6 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          <Plus size={32} />
          <span className="mt-2 text-lg font-medium text-center">
            Crear Negocio
          </span>
        </Link>

        <Link
          href="/negocios"
          className="flex flex-col items-center p-6 bg-yellow-500 text-white rounded-xl shadow hover:bg-yellow-600 transition"
        >
          <Building size={32} />
          <span className="mt-2 text-lg font-medium text-center">
            Ver Negocios
          </span>
        </Link>

        <Link
          href="/reservas/mis-reservas"
          className="flex flex-col items-center p-6 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition"
        >
          <CalendarCheck size={32} />
          <span className="mt-2 text-lg font-medium text-center">
            Mis Reservas
          </span>
        </Link>

        <Link
          href="/reservas"
          className="flex flex-col items-center p-6 bg-purple-600 text-white rounded-xl shadow hover:bg-purple-700 transition"
        >
          <Search size={32} />
          <span className="mt-2 text-lg font-medium text-center">
            Buscar Servicios
          </span>
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm mt-12">
        &copy; {new Date().getFullYear()} Gestor de Reservas. Todos los derechos reservados.
      </footer>
    </div>
  )
}