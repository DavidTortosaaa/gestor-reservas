import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// Fórmula de Haversine para calcular distancia entre dos puntos (en km)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
export async function GET() {
    const session = await getServerSession(authOptions);
  
    if (!session?.user?.email) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }
  
    const usuario = await prisma.usuario.findUnique({
      where: { email: session.user.email },
      select: {
        latitud: true,
        longitud: true,
      },
    });
  
    if (!usuario || usuario.latitud === null || usuario.longitud === null) {
      return NextResponse.json({ message: "Ubicación del usuario no disponible" }, { status: 400 });
    }
  
    const negocios = await prisma.negocio.findMany({
      where: {
        latitud: { not: null },
        longitud: { not: null },
      },
    });
  
    const negociosConDistancia = negocios.map((n) => {
      const distancia = getDistanceKm(
        usuario.latitud!,
        usuario.longitud!,
        n.latitud!,
        n.longitud!
      );
      return { ...n, distancia };
    });
  
    const negociosCercanos = negociosConDistancia
      .filter((n) => n.distancia <= 50) // ← filtro de cercanía
      .sort((a, b) => a.distancia - b.distancia);
  
    return NextResponse.json(negociosCercanos);
  }