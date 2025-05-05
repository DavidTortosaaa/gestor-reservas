/*import { prisma } from "@/lib/prisma";
//import FormNuevaReserva from "@/components/FormNuevaReserva";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

export default async function NuevaReservaPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const negocios = await prisma.negocio.findMany({
    select: {
      id: true,
      nombre: true,
      servicios: {
        select: {
          id: true,
          nombre: true,
          duracion: true,
          precio: true,
        },
      },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nueva Reserva</h1>
      <FormNuevaReserva negocios={negocios} />
    </div>
  );
}*/