import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import NuevoNegocioForm from "@/components/NuevoNegocioForm";
import PageWrapper from "@/components/ui/PageWrapper";

/**
 * Página CrearNegocioPage
 * 
 * Esta página permite al usuario autenticado crear un nuevo negocio.
 * Si el usuario no está autenticado, redirige a la página de inicio de sesión.
 */
export default async function CrearNegocioPage() {
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
   * Renderiza la página de creación de negocios.
   * 
   * Incluye un formulario para ingresar los datos del nuevo negocio.
   */
  return (
    <PageWrapper>
      <NuevoNegocioForm />
    </PageWrapper>
  );
}
