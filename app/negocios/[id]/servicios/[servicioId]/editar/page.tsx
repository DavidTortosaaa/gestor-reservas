import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditarServicioForm from "@/components/EditarServicioForm";
import PageWrapper from "@/components/ui/PageWrapper";

interface Props {
  params: Promise<{
    id: string;         // negocioId
    servicioId: string; // servicioId
  }>;
}



/**
 * Página EditarServicioPage
 * 
 * Esta página permite al usuario autenticado editar un servicio existente asociado a un negocio específico.
 * Si el usuario no está autenticado o no es propietario del negocio, redirige a la página correspondiente.
 */
export default async function EditarServicioPage({ params }: Props) {
  /**
   * Obtiene la sesión del usuario desde el servidor.
   * 
   * Utiliza `next-auth` para verificar si el usuario está autenticado.
   */
  const session = await getServerSession(authOptions);
  const { id: negocioId, servicioId } = await params;
  /**
   * Redirige al usuario a la página de inicio de sesión si no está autenticado.
   */
  if (!session?.user?.email) {
    redirect("/login");
  }

  /**
   * Obtiene los datos del servicio desde la base de datos.
   * 
   * Utiliza Prisma para buscar el servicio por su ID y verificar que el usuario autenticado es el propietario del negocio asociado.
   */
  const servicio = await prisma.servicio.findFirst({
    where: {
      id: servicioId,
      negocio: {
        id: negocioId,
        propietario: {
          email: session.user.email,
        },
      },
    },
  });

  /**
   * Redirige al usuario a la página de negocios si no se encuentra el servicio o no es propietario.
   */
  if (!servicio) {
    redirect("/negocios");
  }

  /**
   * Renderiza la página de edición de servicios.
   * 
   * Incluye un formulario para editar los datos del servicio.
   */
  return (
    <PageWrapper>
      <EditarServicioForm servicio={servicio} />
    </PageWrapper>
  );
}
