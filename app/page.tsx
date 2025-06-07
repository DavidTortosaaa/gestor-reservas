import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AccionRapida } from "@/components/ui/AccionRapida";
import { Building, CalendarCheck, Search, Plus } from "lucide-react";

/**
 * Página principal del Gestor de Reservas.
 * 
 * Esta página muestra un resumen de las acciones rápidas disponibles para los usuarios autenticados,
 * así como un mensaje de bienvenida personalizado.
 */
export default async function Home() {
  /**
   * Obtiene la sesión del usuario autenticado.
   * 
   * @returns La sesión del usuario o una cadena vacía si no está autenticado.
   */
  const session = await getServerSession(authOptions);
  let nombreUsuario = "";

  if (session?.user?.email) {
    /**
     * Busca al usuario en la base de datos utilizando el email de la sesión.
     * 
     * @returns El nombre del usuario o una cadena vacía si no se encuentra.
     */
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });
    if (usuario) nombreUsuario = usuario.nombre;
  }

  /**
   * Renderiza la página principal.
   * 
   * Incluye un mensaje de bienvenida, acciones rápidas y un pie de página.
   */
  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 text-foreground">
      {/* Sección de encabezado */}
      <section className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-White mb-2">Gestor de Reservas</h1>
        <p className="text-gray-500 text-lg">
          Organiza tu negocio. Simplifica tus reservas.
        </p>
        {nombreUsuario && (
          <p className="mt-4 text-lg">
            👋 Bienvenido, <span className="font-semibold">{nombreUsuario}</span>
          </p>
        )}
      </section>

      {/* Sección de acciones rápidas */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AccionRapida href="/negocios/nuevo" icon={Plus} bgColor="bg-blue-600">
          Crear Negocio
        </AccionRapida>
        <AccionRapida href="/negocios" icon={Building} bgColor="bg-yellow-500">
          Ver Negocios
        </AccionRapida>
        <AccionRapida href="/reservas/mis-reservas" icon={CalendarCheck} bgColor="bg-green-600">
          Mis Reservas
        </AccionRapida>
        <AccionRapida href="/reservas" icon={Search} bgColor="bg-purple-600">
          Buscar Servicios
        </AccionRapida>
      </section>

      {/* Pie de página */}
      <footer className="text-center text-gray-500 text-sm mt-12">
        &copy; {new Date().getFullYear()} Gestor de Reservas. Todos los derechos reservados a David Tortosa.
      </footer>
    </div>
  );
}
