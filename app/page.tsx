import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { AccionRapida } from "@/components/ui/AccionRapida";
import { Building, CalendarCheck, Search, Plus } from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);
  let nombreUsuario = "";

  if (session?.user?.email) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });
    if (usuario) nombreUsuario = usuario.nombre;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 text-foreground">
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

      <footer className="text-center text-gray-500 text-sm mt-12">
        &copy; {new Date().getFullYear()} Gestor de Reservas. Todos los derechos reservados.
      </footer>
    </div>
  );
}
