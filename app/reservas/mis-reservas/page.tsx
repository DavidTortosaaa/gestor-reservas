import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageWrapper from "@/components/ui/PageWrapper";
import ReservaCard from "@/components/ReservaCard"; // 👈 Importamos el nuevo componente

export default async function MisReservasPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!usuario) redirect("/login");

  const ahora = new Date();

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

  const futuras = reservas.filter((r) => r.fechaHora > ahora);
  const pasadas = reservas.filter((r) => r.fechaHora <= ahora);

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
