import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageWrapper from "@/components/ui/PageWrapper";
import ReservaCard from "@/components/ReservaCard";

/**
 * Página MisReservasPage
 * 
 * Esta página muestra las reservas realizadas por el usuario autenticado.
 * Divide las reservas en futuras y pasadas, agrupándolas por negocio.
 * Si el usuario no está autenticado, redirige a la página de inicio de sesión.
 */
export default async function MisReservasPage() {
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
   * Obtiene los datos del usuario desde la base de datos.
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

  const ahora = new Date();

  /**
   * Obtiene las reservas del usuario desde la base de datos.
   * 
   * Incluye información sobre el servicio y el negocio asociado a cada reserva.
   * Ordena las reservas por fecha y hora en orden ascendente.
   */
  const reservas = await prisma.reserva.findMany({
    where: { clienteId: usuario.id },
    include: {
      servicio: {
        include: {
          negocio: true,
        },
      },
    },
    orderBy: { fechaHora: "asc" },
  });

  /**
   * Agrupa las reservas por negocio y las divide en futuras y pasadas.
   */
  const reservasPorNegocio = reservas.reduce((acc, reserva) => {
    const negocioId = reserva.servicio.negocio.id;
    const negocioNombre = reserva.servicio.negocio.nombre;

    if (!acc[negocioId]) {
      acc[negocioId] = {
        nombre: negocioNombre,
        futuras: [],
        pasadas: [],
      };
    }

    if (reserva.fechaHora > ahora) {
      acc[negocioId].futuras.push(reserva);
    } else {
      acc[negocioId].pasadas.push(reserva);
    }

    return acc;
  }, {} as Record<string, { nombre: string; futuras: typeof reservas; pasadas: typeof reservas }>);

  /**
   * Ordena los negocios alfabéticamente por nombre.
   */
  const gruposOrdenados = Object.entries(reservasPorNegocio).sort((a, b) =>
    a[1].nombre.localeCompare(b[1].nombre)
  );

  /**
   * Renderiza la página de "Mis Reservas".
   * 
   * Incluye secciones para las reservas futuras y el historial de reservas pasadas, agrupadas por negocio.
   */
  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 rounded shadow-lg w-fit mb-6">Mis reservas</h1>

      {gruposOrdenados.map(([negocioId, grupo]) => (
        <div key={negocioId} className="mb-10 text-white">
          <h2 className="flex items-center gap-2 text-white font-bold text-lg bg-gradient-to-br from-blue-600 to-blue-800 px-6 py-3 rounded-t-lg shadow-md w-fit mb-6">🏢 {grupo.nombre}</h2>

          {/* Futuras */}
          <section className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Próximas Reservas</h3>
            {grupo.futuras.length === 0 ? (
              <p>No tienes reservas futuras en este negocio.</p>
            ) : (
              <ul className="space-y-4">
                {grupo.futuras
                  .sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime())
                  .map((reserva) => (
                    <ReservaCard key={reserva.id} reserva={reserva} />
                  ))}
              </ul>
            )}
          </section>

          {/* Pasadas */}
          <section>
            <h3 className="text-xl font-semibold mb-2">Historial</h3>
            {grupo.pasadas.length === 0 ? (
              <p>No tienes reservas pasadas en este negocio.</p>
            ) : (
              <ul className="space-y-4">
                {grupo.pasadas
                  .sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime())
                  .map((reserva) => (
                    <ReservaCard key={reserva.id} reserva={reserva} esPasada />
                  ))}
              </ul>
            )}
          </section>
        </div>
      ))}
    </PageWrapper>
  );
}
