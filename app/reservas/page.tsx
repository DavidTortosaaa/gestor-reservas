import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import NegocioPublicoCard from "@/components/NegocioPublicoCard";
import Link from "next/link"; 

type PageProps = {
  searchParams?: {
    buscar?: string;
  };
};

export default async function ReservasPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Reservar un Servicio</h1>
       {/* Botón a mis reservas */}
       <div className="mb-6">
        <Link
          href="/reservas/mis-reservas"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ver Mis Reservas
        </Link>
      </div>
      <p className="mb-4">Selecciona un negocio para ver sus servicios disponibles:</p>

      <form className="mb-6">
        <input
          type="text"
          name="buscar"
          placeholder="Buscar negocios por nombre..."
          defaultValue={searchParams?.buscar || ""}
          className="w-full max-w-md px-4 py-2 border rounded"
        />
      </form>

      {negocios.length === 0 ? (
        <p>No hay negocios disponibles{filtro ? ` para "${filtro}"` : ""}.</p>
      ) : (
        <ul className="space-y-4">
          {negocios.map((negocio) => (
            <NegocioPublicoCard key={negocio.id} negocio={negocio} />
          ))}
        </ul>
      )}
    </div>
  );
}
