import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServicioPublicoCard from "@/components/ServicioPublicoCard";
import PageWrapper from "@/components/ui/PageWrapper";

interface Props{
  params: Promise <{
    id: string; // ID único del negocio 
  }>;
};

/**
 * Página ServiciosDelNegocio
 * 
 * Esta página muestra los servicios disponibles en un negocio específico.
 * Si el usuario no está autenticado, redirige a la página de inicio de sesión.
 * Si el negocio no existe, redirige a la página de reservas.
 */
export default async function ServiciosDelNegocio({ params }: Props) {
  /**
   * Obtiene la sesión del usuario desde el servidor.
   * 
   * Utiliza `next-auth` para verificar si el usuario está autenticado.
   */
  const session = await getServerSession(authOptions);

  /**
   * Redirige al usuario a la página de inicio de sesión si no está autenticado.
   */
  if (!session) {
    redirect("/login");
  }
  const { id } = await params;

  /**
   * Obtiene los datos del negocio desde la base de datos.
   * 
   * Utiliza Prisma para buscar el negocio por su ID e incluir los servicios asociados.
   */
  const negocio = await prisma.negocio.findUnique({
    where: { id },
    include: {
      servicios: true,
    },
  });

  /**
   * Redirige al usuario a la página de reservas si el negocio no existe.
   */
  if (!negocio) {
    redirect("/reservas");
  }

  /**
   * Renderiza la página de servicios disponibles en el negocio.
   * 
   * Incluye un título, dirección del negocio (si está disponible) y una lista de servicios.
   */
  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 rounded shadow-lg w-fit mb-6">
        Servicios disponibles en {negocio.nombre}
      </h1>
      {negocio.direccion && (
        <p className="text-white mb-6 text-sm">📍 {negocio.direccion}</p>
      )}

      {negocio.servicios.length === 0 ? (
        <p className="text-white">Este negocio no tiene servicios disponibles por ahora.</p>
      ) : (
        <ul className="space-y-4">
          {negocio.servicios.map((servicio) => (
            <ServicioPublicoCard
              key={servicio.id}
              servicio={servicio}
              negocio={negocio}
            />
          ))}
        </ul>
      )}
    </PageWrapper>
  );
}
