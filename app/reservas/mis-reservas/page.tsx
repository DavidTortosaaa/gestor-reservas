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
 * Divide las reservas en futuras y pasadas para facilitar la navegación.
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
   * Divide las reservas en futuras y pasadas según la fecha y hora actual.
   */
  const futuras = reservas.filter((r) => r.fechaHora > ahora);
  const pasadas = reservas.filter((r) => r.fechaHora <= ahora);

  /**
   * Renderiza la página de "Mis Reservas".
   * 
   * Incluye secciones para las reservas futuras y el historial de reservas pasadas.
   */
  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-6 text-white">Mis reservas</h1>

      {/* Reservas futuras */}
      <section className="mb-10 text-white">
        <h2 className="text-xl font-semibold mb-4">Próximas Reservas</h2>
        {futuras.length === 0 ? (
          <p>No tienes reservas futuras.</p>
        ) : (
          <ul className="space-y-4">
            {futuras.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} />
            ))}
          </ul>
        )}
      </section>

      {/* Historial */}
      <section className="mb-10 text-white">
        <h2 className="text-xl font-semibold mb-4">Historial de Reservas</h2>
        {pasadas.length === 0 ? (
          <p>No tienes reservas pasadas.</p>
        ) : (
          <ul className="space-y-4">
            {pasadas.map((reserva) => (
              <ReservaCard key={reserva.id} reserva={reserva} esPasada />
            ))}
          </ul>
        )}
      </section>
    </PageWrapper>
  );
}
