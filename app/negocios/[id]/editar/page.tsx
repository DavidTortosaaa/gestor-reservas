import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditarNegocioForm from "@/components/EditarNegocioForm";

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Editar Negocio</h1>
      <EditarNegocioForm negocio={negocio} />
    </div>
  );
}
