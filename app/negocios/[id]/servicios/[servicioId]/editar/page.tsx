import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditarServicioForm from "@/components/EditarServicioForm";
import PageWrapper from "@/components/ui/PageWrapper";

type PageProps = {
  params: {
    id: string; // negocioId
    servicioId: string; // servicioId
  };
};

export default async function EditarServicioPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const servicio = await prisma.servicio.findFirst({
    where: {
      id: params.servicioId,
      negocio: {
        id: params.id,
        propietario: {
          email: session.user.email,
        },
      },
    },
  });

  if (!servicio) {
    redirect("/negocios");
  }

  return (
    <PageWrapper>
      <EditarServicioForm servicio={servicio} />
    </PageWrapper>
  );
}
