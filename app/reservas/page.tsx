import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NegociosCliente from "@/components/NegociosCliente";
import PageWrapper from "@/components/ui/PageWrapper";

type PageProps = {
  searchParams?: {
    buscar?: string; // Parámetro de búsqueda para filtrar negocios por nombre
  };
};

/**
 * Página ReservasPage
 * 
 * Esta página muestra una lista de negocios disponibles para reservar servicios.
 * Permite filtrar negocios por nombre utilizando un parámetro de búsqueda.
 * Si el usuario no está autenticado, redirige a la página de inicio de sesión.
 */
export default async function ReservasPage({ searchParams }: PageProps) {
  /**
   * Obtiene la sesión del usuario desde el servidor.
   * 
   * Utiliza `next-auth` para verificar si el usuario está autenticado.
   */
  const session = await getServerSession(authOptions);

  /**
   * Redirige al usuario a la página de inicio de sesión si no está autenticado.
   */
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  /**
   * Obtiene la lista de negocios desde la base de datos.
   * 
   * Utiliza Prisma para buscar negocios cuyo nombre coincida con el filtro de búsqueda.
   * Ordena los negocios por nombre en orden ascendente.
   */
  const filtro = searchParams?.buscar?.toLowerCase() || "";

  const negocios = await prisma.negocio.findMany({
    where: {
      nombre: {
        contains: filtro,
        mode: "insensitive",
      },
    },
    orderBy: { nombre: "asc" },
  });

  /**
   * Renderiza la página de reservas.
   * 
   * Incluye un componente que muestra la lista de negocios y permite interactuar con ellos.
   */
  return (
    <PageWrapper>
      <NegociosCliente negocios={negocios} filtroInicial={filtro} />
    </PageWrapper>
  );
}
