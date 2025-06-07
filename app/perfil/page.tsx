import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/ProfileForm";
import PageWrapper from "@/components/ui/PageWrapper"; 

/**
 * Página PerfilPage
 * 
 * Esta página muestra el formulario de perfil del usuario autenticado.
 * Si el usuario no está autenticado, redirige a la página de inicio de sesión.
 */
export default async function PerfilPage() {
  /**
   * Obtiene la sesión del usuario desde el servidor.
   * 
   * Utiliza `next-auth` para verificar si el usuario está autenticado.
   */
  const session = await getServerSession(authOptions);

  /**
   * Redirige al usuario a la página de inicio de sesión si no está autenticado.
   */
  if (!session || !session.user?.email) {
    redirect("/login");
  }

  /**
   * Renderiza la página de perfil.
   * 
   * Incluye el formulario de perfil dentro de un envoltorio para estilos consistentes.
   */
  return (
    <PageWrapper> {/* Envoltorio para aplicar estilos globales */}
      <ProfileForm /> {/* Formulario para editar el perfil del usuario */}
    </PageWrapper>
  );
}
