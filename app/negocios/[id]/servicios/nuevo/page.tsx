import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import NuevoServicioForm from "@/components/NuevoServicioForm"; // 👈 Componente que ya te pasé

type PageProps = {
  params: {
    id: string; // ID del negocio
  };
};

export default async function NuevoServicioPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
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
      <NuevoServicioForm negocioId={negocio.id} />
    </div>
  );
}