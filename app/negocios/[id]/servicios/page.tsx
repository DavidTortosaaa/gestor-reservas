import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import Link from "next/link";
import ServicioCard from "@/components/ServicioCard";
import PageWrapper from "@/components/ui/PageWrapper";

interface Props{
  params: Promise <{
    id: string; // ID único del negocio 
  }>;
};

/**
 * Página ServiciosPage
 * 
 * Esta página muestra los servicios asociados a un negocio específico.
 * Permite al usuario autenticado crear nuevos servicios y gestionar los existentes.
 * Si el usuario no está autenticado o no es propietario del negocio, redirige a la página correspondiente.
 */
export default async function ServiciosPage({ params }: Props) {
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
  const { id } = await params;

  /**
   * Obtiene los datos del negocio desde la base de datos.
   * 
   * Utiliza Prisma para buscar el negocio por su ID y verificar que el usuario autenticado es el propietario.
   * Incluye los servicios asociados al negocio.
   */
  const negocio = await prisma.negocio.findFirst({
    where: {
      id,
      propietario: { email: session.user.email },
    },
    include: { servicios: true },
  });

  /**
   * Redirige al usuario a la página de negocios si no se encuentra el negocio o no es propietario.
   */
  if (!negocio) {
    redirect("/negocios");
  }

  /**
   * Renderiza la página de servicios del negocio.
   * 
   * Incluye un botón para crear nuevos servicios y una lista de servicios existentes.
   */
  return (
    <PageWrapper>
      {/* Título de la página */}
      <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-blue-700 to-blue-900 px-6 py-4 rounded shadow-lg w-fit mb-6">Servicios de {negocio.nombre}</h1>

      {/* Botón para crear un nuevo servicio */}
      <Link
        href={`/negocios/${negocio.id}/servicios/nuevo`}
        className="inline-block mb-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 shadow"
      >
        +Crear nuevo servicio
      </Link>

      {/* Lista de servicios o mensaje si no hay servicios */}
      {negocio.servicios.length === 0 ? (
        <p className="text-white">No has creado ningún servicio todavía.</p>
      ) : (
        <ul className="space-y-3">
          {negocio.servicios.map((servicio) => (
            <ServicioCard
              key={servicio.id}
              servicio={{ ...servicio, negocioId: negocio.id }}
            />
          ))}
        </ul>
      )}
    </PageWrapper>
  );
}
