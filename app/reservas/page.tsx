import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NegociosCliente from "@/components/NegociosCliente";
import PageWrapper from "@/components/ui/PageWrapper";

type PageProps = {
  searchParams?: {
    buscar?: string;
  };
};

export default async function ReservasPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/login");
  }

  const filtro = searchParams?.buscar?.toLowerCase() || "";

  const negocios = await prisma.negocio.findMany({
    where: {
      nombre: {
        contains: filtro,
        mode: "insensitive",
      },
    },
    orderBy: { nombre: "asc" },
  });

  return (
    <PageWrapper>
      <NegociosCliente negocios={negocios} filtroInicial={filtro} />
    </PageWrapper>
  );
}
