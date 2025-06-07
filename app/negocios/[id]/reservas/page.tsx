import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { OpcionesReservaButtons } from "@/components/OpcionesReservaButtons";
import PageWrapper from "@/components/ui/PageWrapper";
import ReservaAdminCard from "@/components/ReservaAdminCard";
import Link from "next/link";

type PageProps = {
  params: { id: string };
  searchParams?: { estado?: string; fecha?: string };
};

export default async function ReservasNegocioPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const estadoFiltro = searchParams?.estado;
  const fechaFiltro = searchParams?.fecha;

  await prisma.reserva.deleteMany({
    where: {
      fechaHora: { lt: new Date() },
      estado: { in: ["pendiente", "cancelada"] },
      servicio: {
        negocio: { propietario: { email: session.user.email } },
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
            include: { cliente: true },
            orderBy: { fechaHora: "desc" },
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
    <PageWrapper>
      <h1 className="text-3xl font-bold text-white mb-6">Reservas de {negocio.nombre}</h1>

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
