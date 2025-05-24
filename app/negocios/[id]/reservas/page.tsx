import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OpcionesReservaButtons } from "@/components/OpcionesReservaButtons";
import Link from "next/link";

type PageProps = {
  params: { id: string };
  searchParams?: { estado?: string; fecha?: string };
};

export default async function ReservasNegocioPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) redirect("/login");

  const estadoFiltro = searchParams?.estado;
  const fechaFiltro = searchParams?.fecha;

  // Limpiar reservas pasadas con estado pendiente o cancelada
  await prisma.reserva.deleteMany({
    where: {
      fechaHora: { lt: new Date() },
      estado: { in: ["pendiente", "cancelada"] },
      servicio: {
        negocio: {
          propietario: {
            email: session.user.email,
          },
        },
      },
    },
  });

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
            include: {
              cliente: true,
            },
            orderBy: {
              fechaHora: "desc",
            },
          },
        },
      },
    },
  });

  if (!negocio) redirect("/negocios");

  const reservas = negocio.servicios.flatMap((servicio) =>
    servicio.reservas.map((reserva) => ({
      ...reserva,
      servicioNombre: servicio.nombre,
    }))
  );

  const reservasPorDia = reservas.reduce((acc, reserva) => {
    const fechaKey = new Date(reserva.fechaHora).toISOString().split("T")[0];
    if (!acc[fechaKey]) acc[fechaKey] = [];
    acc[fechaKey].push(reserva);
    return acc;
  }, {} as Record<string, typeof reservas>);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reservas de {negocio.nombre}</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <form method="GET" className="flex flex-col sm:flex-row items-center gap-2 text-black">
          <label htmlFor="fecha">Filtrar por fecha:</label>
          <input
            id="fecha"
            type="date"
            name="fecha"
            defaultValue={fechaFiltro || ""}
            className="border border-gray-300 rounded px-3 py-1"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded shadow"
          >
            Filtrar
          </button>
        </form>

        <Link
          href={`/negocios/${negocio.id}/reservas`}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          Limpiar filtros
        </Link>
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded shadow flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-gray-800 mr-2">Filtrar por estado:</span>
        <Link
          href={`/negocios/${negocio.id}/reservas`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Todos
        </Link>
        <Link
          href={`/negocios/${negocio.id}/reservas?estado=pendiente`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Pendiente
        </Link>
        <Link
          href={`/negocios/${negocio.id}/reservas?estado=confirmada`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Confirmada
        </Link>
        <Link
          href={`/negocios/${negocio.id}/reservas?estado=cancelada`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Cancelada
        </Link>
      </div>

      {reservas.length === 0 ? (
        <p>No hay reservas{estadoFiltro ? ` con estado "${estadoFiltro}"` : ""}.</p>
      ) : (
        Object.entries(reservasPorDia).map(([fecha, reservasDelDia]) => (
          <div key={fecha} className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              {new Date(fecha).toLocaleDateString()}
            </h2>
            <ul className="space-y-4">
              {reservasDelDia.map((reserva) => (
                <li key={reserva.id} className="bg-white p-4 rounded shadow text-black">
                  <p>
                    <strong>Servicio:</strong> {reserva.servicioNombre}
                  </p>
                  <p>
                    <strong>Cliente:</strong> {reserva.cliente?.nombre || "Desconocido"}
                  </p>
                  <p>
                    <strong>Hora:</strong>{" "}
                    {new Date(reserva.fechaHora).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <strong>Estado:</strong> {reserva.estado}
                  </p>
                  {reserva.estado === "pendiente" && (
                    <OpcionesReservaButtons reservaId={reserva.id} />
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}