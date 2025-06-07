import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NuevoServicioForm from "@/components/NuevoServicioForm";
import PageWrapper from "@/components/ui/PageWrapper";

type PageProps = {
  params: { id: string }; // ID único del negocio
};

/**
 * Página NuevoServicioPage
 * 
 * Esta página permite al usuario autenticado crear un nuevo servicio asociado a un negocio específico.
 * Si el usuario no está autenticado o no es propietario del negocio, redirige a la página correspondiente.
 */
export default async function NuevoServicioPage({ params }: PageProps) {
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
   * Obtiene los datos del negocio desde la base de datos.
   * 
   * Utiliza Prisma para buscar el negocio por su ID y verificar que el usuario autenticado es el propietario.
   */
  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
      propietario: {
        email: session.user.email,
      },
    },
  });

  /**
   * Redirige al usuario a la página de negocios si no se encuentra el negocio o no es propietario.
   */
  if (!negocio) redirect("/negocios");

  /**
   * Renderiza la página de creación de servicios.
   * 
   * Incluye un formulario para ingresar los datos del nuevo servicio.
   */
  return (
    <PageWrapper>
      <NuevoServicioForm negocioId={negocio.id} />
    </PageWrapper>
  );
}
