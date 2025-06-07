import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import ReservaForm from "@/components/ReservaForm";
import PageWrapper from "@/components/ui/PageWrapper";

type PageProps = {
  params: {
    id: string;            
    servicioId: string;   
  };
};

export default async function ReservaServicioPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const servicio = await prisma.servicio.findFirst({
    where: {
      id: params.servicioId,
      negocioId: params.id, 
    },
    include: {
      negocio: true,
    },
  });

  if (!servicio) {
    redirect("/reservas");
  }

  return (
    <PageWrapper>
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow text-black">
        <h1 className="text-2xl font-bold mb-4">Reservar: {servicio.nombre}</h1>
        {servicio.descripcion && (
          <p className="mb-2 text-gray-700">{servicio.descripcion}</p>
        )}
        <p>🕒Duración: {servicio.duracion} minutos</p>
        <p>💶Precio: {servicio.precio.toFixed(2)} €</p>

        <div className="mt-6">
          <ReservaForm
            servicioId={servicio.id}
            duracion={servicio.duracion}
            apertura={servicio.negocio.horario_apertura}
            cierre={servicio.negocio.horario_cierre}
          />
        </div>
      </div>
    </PageWrapper>
  );
}
