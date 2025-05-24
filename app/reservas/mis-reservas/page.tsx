import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CancelarReservaButton from "@/components/CancelarReservaButton";

export default async function MisReservasPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  // Obtener el usuario (para extraer ID real desde la DB si es necesario)
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!usuario) redirect("/login");

  const ahora = new Date();

  const reservas = await prisma.reserva.findMany({
    where: {
      clienteId: usuario.id,
    },
    include: {
      servicio: {
        include: {
          negocio: true,
        },
      },
    },
    orderBy: {
      fechaHora: "asc",
    },
  });

  const futuras = reservas.filter((r) => r.fechaHora > ahora);
  const pasadas = reservas.filter((r) => r.fechaHora <= ahora);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mis Reservas</h1>

      {/* Reservas futuras */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Próximas Reservas</h2>
        {futuras.length === 0 ? (
          <p>No tienes reservas futuras.</p>
        ) : (
          <ul className="space-y-4">
            {futuras.map((reserva) => (
              <li key={reserva.id} className="bg-white p-4 rounded shadow text-black">
                <p><strong>Negocio:</strong> {reserva.servicio.negocio.nombre}</p>
                <p><strong>Servicio:</strong> {reserva.servicio.nombre}</p>
                <p><strong>Fecha:</strong> {new Date(reserva.fechaHora).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {new Date(reserva.fechaHora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                <p><strong>Estado:</strong> {reserva.estado}</p>

                {["pendiente", "confirmada"].includes(reserva.estado) && (
                  <CancelarReservaButton reservaId={reserva.id} />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Historial */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Historial de Reservas</h2>
        {pasadas.length === 0 ? (
          <p>No tienes reservas pasadas.</p>
        ) : (
          <ul className="space-y-4">
            {pasadas.map((reserva) => (
              <li key={reserva.id} className="bg-gray-100 p-4 rounded shadow text-black">
                <p><strong>Negocio:</strong> {reserva.servicio.negocio.nombre}</p>
                <p><strong>Servicio:</strong> {reserva.servicio.nombre}</p>
                <p><strong>Fecha:</strong> {new Date(reserva.fechaHora).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {new Date(reserva.fechaHora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                <p><strong>Estado:</strong> {reserva.estado}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
