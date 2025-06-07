import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NuevoServicioForm from "@/components/NuevoServicioForm";
import PageWrapper from "@/components/ui/PageWrapper";

type PageProps = {
  params: { id: string };
};

export default async function NuevoServicioPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) redirect("/login");

  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
      propietario: {
        email: session.user.email,
      },
    },
  });

  if (!negocio) redirect("/negocios");

  return (
    <PageWrapper>
      <NuevoServicioForm negocioId={negocio.id} />
    </PageWrapper>
  );
}
