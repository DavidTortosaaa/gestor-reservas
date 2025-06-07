import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditarNegocioForm from "@/components/EditarNegocioForm";
import PageWrapper from "@/components/ui/PageWrapper"; // 👈

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function EditarNegocioPage({ params }: PageProps) {
  const { id: negocioId } = params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const negocio = await prisma.negocio.findFirst({
    where: {
      id: negocioId,
      propietario: {
        email: session.user.email,
      },
    },
  });

  if (!negocio) {
    redirect("/negocios");
  }

  return (
    <PageWrapper>
      <EditarNegocioForm negocio={negocio} />
    </PageWrapper>
  );
}
