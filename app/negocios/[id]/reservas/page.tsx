import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import PageWrapper from "@/components/ui/PageWrapper";
import ReservaAdminCard from "@/components/ReservaAdminCard";
import Link from "next/link";

type PageProps = {
  params: { id: string }; // ID único del negocio
  searchParams?: { estado?: string; fecha?: string }; // Parámetros de búsqueda para filtrar reservas
};

/**
 * Página ReservasNegocioPage
 * 
 * Esta página muestra las reservas asociadas a un negocio específico.
 * Permite filtrar las reservas por estado y fecha.
 * Si el usuario no está autenticado o no es propietario del negocio, redirige a la página correspondiente.
 */
export default async function ReservasNegocioPage({ params, searchParams }: PageProps) {
  /**
   * Obtiene la sesión del usuario desde el servidor.
   * 
   * Utiliza `next-auth` para verificar si el usuario está autenticado.
   */
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const estadoFiltro = searchParams?.estado; // Filtro por estado de la reserva
  const fechaFiltro = searchParams?.fecha; // Filtro por fecha de la reserva

  /**
   * Elimina reservas pasadas que están pendientes o canceladas.
   * 
   * Utiliza Prisma para limpiar la base de datos de reservas obsoletas.
   */
  await prisma.reserva.deleteMany({
    where: {
      fechaHora: { lt: new Date() },
      estado: { in: ["pendiente", "cancelada"] },
      servicio: {
        negocio: { propietario: { email: session.user.email } },
      },
    },
  });

  /**
   * Obtiene los datos del negocio desde la base de datos.
   * 
   * Utiliza Prisma para buscar el negocio por su ID y verificar que el usuario autenticado es el propietario.
   */
  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
      propietario: { email: session.user.email },
    },
    include: {
      servicios: {
        include: {
          reservas: {
            where: {
              ...(estadoFiltro ? { estado: estadoFiltro } : {}),
              ...(fechaFiltro
                ? {
                    fechaHora: {
                      gte: new Date(`${fechaFiltro}T00:00:00`),
                      lt: new Date(`${fechaFiltro}T23:59:59`),
                    },
                  }
                : {}),
            },
            include: { cliente: true },
            orderBy: { fechaHora: "desc" },
          },
        },
      },
    },
  });

  /**
   * Redirige al usuario a la página de negocios si no se encuentra el negocio o no es propietario.
   */
  if (!negocio) redirect("/negocios");

  /**
   * Procesa las reservas para agruparlas por día.
   */
  const reservas = negocio.servicios.flatMap((servicio) =>
    servicio.reservas.map((reserva) => ({
      ...reserva,
      servicioNombre: servicio.nombre,
    }))
  );

  //  Ordenar todas las reservas por fecha y hora (ascendente)
  reservas.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());

  //  Agrupar por día ya ordenado
  const reservasPorDia = reservas.reduce((acc, reserva) => {
    const fechaKey = new Date(reserva.fechaHora).toISOString().split("T")[0];
    if (!acc[fechaKey]) acc[fechaKey] = [];
    acc[fechaKey].push(reserva);
    return acc;
  }, {} as Record<string, typeof reservas>);

  /**
   * Renderiza la página de reservas del negocio.
   * 
   * Incluye filtros por estado y fecha, y muestra las reservas agrupadas por día.
   */
  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 rounded shadow-lg w-fit mb-6">Reservas de {negocio.nombre}</h1>

      {/* Filtros */}
      <div className="mb-6 bg-white rounded-lg shadow p-4 text-black space-y-4">
        <form method="GET" className="flex flex-col sm:flex-row items-center gap-3">
          <label htmlFor="fecha" className="font-medium">Filtrar por fecha:</label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            defaultValue={fechaFiltro || ""}
            className="border border-gray-300 rounded px-3 py-1"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Filtrar
          </button>
          <Link
            href={`/negocios/${negocio.id}/reservas`}
            className="text-blue-600 underline text-sm ml-auto"
          >
            Limpiar filtros
          </Link>
        </form>

        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold">Filtrar por estado:</span>
          {["pendiente", "confirmada", "cancelada"].map((estado) => (
            <Link
              key={estado}
              href={`/negocios/${negocio.id}/reservas?estado=${estado}`}
              className={`px-3 py-1 rounded ${
                estadoFiltro === estado
                  ? "bg-blue-600 text-white"
                  : "text-blue-600 underline hover:text-blue-800"
              }`}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      {/* Resultados */}
      {reservas.length === 0 ? (
        <p className="text-white">
          No hay reservas{estadoFiltro ? ` con estado "${estadoFiltro}"` : ""}.
        </p>
      ) : (
        Object.entries(reservasPorDia).map(([fecha, reservasDelDia]) => (
          <div key={fecha} className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">
              {new Date(fecha).toLocaleDateString()}
            </h2>
            <ul className="space-y-4">
              {reservasDelDia.map((reserva) => (
                <ReservaAdminCard key={reserva.id} reserva={reserva} />
              ))}
            </ul>
          </div>
        ))
      )}
    </PageWrapper>
  );
}
