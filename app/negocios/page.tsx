import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NegocioCard from "@/components/NegocioCard";
import Link from "next/link";
import PageWrapper from "@/components/ui/PageWrapper";

/**
 * Página NegociosPage
 * 
 * Esta página muestra una lista de negocios creados por el usuario autenticado.
 * Permite al usuario crear nuevos negocios y gestionar los existentes.
 */
export default async function NegociosPage() {
  /**
   * Obtiene la sesión del usuario desde el servidor.
   * 
   * Utiliza `next-auth` para verificar si el usuario está autenticado.
   */
  const session = await getServerSession(authOptions);

  /**
   * Redirige al usuario a la página de inicio de sesión si no está autenticado.
   */
  if (!session?.user?.email) redirect("/login");

  /**
   * Obtiene los datos del usuario autenticado desde la base de datos.
   * 
   * Utiliza Prisma para buscar al usuario por su correo electrónico.
   */
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Redirige al usuario a la página de inicio de sesión si no se encuentra en la base de datos.
   */
  if (!usuario) redirect("/login");

  /**
   * Obtiene la lista de negocios creados por el usuario desde la base de datos.
   * 
   * Utiliza Prisma para buscar negocios cuyo propietario sea el usuario autenticado.
   */
  const negocios = await prisma.negocio.findMany({
    where: { propietarioId: usuario.id },
  });

  /**
   * Renderiza la página de negocios.
   * 
   * Incluye un botón para crear nuevos negocios y una lista de negocios existentes.
   */
  return (
    <PageWrapper>
      {/* Título de la página */}
      <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 rounded shadow-lg w-fit mb-6">Mis Negocios</h1>

      {/* Botón para crear un nuevo negocio */}
      <Link
        href="/negocios/nuevo"
        className="inline-block mb-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        + Crear nuevo negocio
      </Link>

      {/* Lista de negocios o mensaje si no hay negocios */}
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
  );
}
