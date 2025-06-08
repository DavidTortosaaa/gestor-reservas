import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditarNegocioForm from "@/components/EditarNegocioForm";
import PageWrapper from "@/components/ui/PageWrapper";



interface Props{
  params: Promise <{
    id: string; // ID único del negocio que se desea editar
  }>;
};

/**
 * Página EditarNegocioPage
 * 
 * Esta página permite al usuario autenticado editar un negocio existente.
 * Si el usuario no está autenticado o no es propietario del negocio, redirige a la página correspondiente.
 */
export default async function EditarNegocioPage({ params }:Props) {
  

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
  const { id: negocioId } = await params;

  /**
   * Obtiene los datos del negocio desde la base de datos.
   * 
   * Utiliza Prisma para buscar el negocio por su ID y verificar que el usuario autenticado es el propietario.
   */
  const negocio = await prisma.negocio.findFirst({
    where: {
      id: negocioId,
      propietario: {
        email: session.user.email,
      },
    },
  });

  /**
   * Redirige al usuario a la página de negocios si no se encuentra el negocio o no es propietario.
   */
  if (!negocio) {
    redirect("/negocios");
  }

  /**
   * Renderiza la página de edición de negocios.
   * 
   * Incluye un formulario para editar los datos del negocio.
   */
  return (
    <PageWrapper>
      <EditarNegocioForm negocio={negocio} />
    </PageWrapper>
  );
}
