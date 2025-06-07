import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ServicioPublicoCard from "@/components/ServicioPublicoCard";
import PageWrapper from "@/components/ui/PageWrapper";

type PageProps = {
  params: {
    id: string; // ID del negocio
  };
};

export default async function ServiciosDelNegocio({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const negocio = await prisma.negocio.findUnique({
    where: { id: params.id },
    include: {
      servicios: true,
    },
  });

  if (!negocio) {
    redirect("/reservas");
  }

  return (
    <PageWrapper>
      <h1 className="text-3xl font-bold mb-2 text-white">
        Servicios disponibles en {negocio.nombre}
      </h1>
      {negocio.direccion && (
        <p className="text-white mb-6 text-sm">📍 {negocio.direccion}</p>
      )}

      {negocio.servicios.length === 0 ? (
        <p className="text-white">Este negocio no tiene servicios disponibles por ahora.</p>
      ) : (
        <ul className="space-y-4">
          {negocio.servicios.map((servicio) => (
            <ServicioPublicoCard
              key={servicio.id}
              servicio={servicio}
              negocio={negocio}
            />
          ))}
        </ul>
      )}
    </PageWrapper>
  );
}
