import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import ReservaForm from "@/components/ReservaForm";
import PageWrapper from "@/components/ui/PageWrapper";

type PageProps = {
  params: {
    id: string;            // ID único del negocio
    servicioId: string;    // ID único del servicio
  };
};

/**
 * Página ReservaServicioPage
 * 
 * Esta página permite al usuario autenticado reservar un servicio específico de un negocio.
 * Si el usuario no está autenticado, redirige a la página de inicio de sesión.
 * Si el servicio o negocio no existe, redirige a la página de reservas.
 */
export default async function ReservaServicioPage({ params }: PageProps) {
  /**
   * Obtiene la sesión del usuario desde el servidor.
   * 
   * Utiliza `next-auth` para verificar si el usuario está autenticado.
   */
  const session = await getServerSession(authOptions);

  /**
   * Redirige al usuario a la página de inicio de sesión si no está autenticado.
   */
  if (!session?.user?.email) {
    redirect("/login");
  }

  /**
   * Obtiene los datos del servicio desde la base de datos.
   * 
   * Utiliza Prisma para buscar el servicio por su ID y verificar que pertenece al negocio especificado.
   * Incluye información del negocio asociado.
   */
  const servicio = await prisma.servicio.findFirst({
    where: {
      id: params.servicioId,
      negocioId: params.id,
    },
    include: {
      negocio: true,
    },
  });

  /**
   * Redirige al usuario a la página de reservas si el servicio no existe.
   */
  if (!servicio) {
    redirect("/reservas");
  }

  /**
   * Renderiza la página de reserva del servicio.
   * 
   * Incluye información detallada del servicio y un formulario para realizar la reserva.
   */
  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow text-black">
        {/* Título del servicio */}
        <h1 className="text-2xl font-bold mb-4">Reservar: {servicio.nombre}</h1>

        {/* Descripción del servicio (opcional) */}
        {servicio.descripcion && (
          <p className="mb-2 text-gray-700">{servicio.descripcion}</p>
        )}

        {/* Detalles del servicio */}
        <p>🕒 Duración: {servicio.duracion} minutos</p>
        <p>💶 Precio: {servicio.precio.toFixed(2)} €</p>

        {/* Formulario de reserva */}
        <div className="mt-6">
          <ReservaForm
            servicioId={servicio.id}
            duracion={servicio.duracion}
            apertura={servicio.negocio.horario_apertura}
            cierre={servicio.negocio.horario_cierre}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
