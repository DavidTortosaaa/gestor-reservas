import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * Fórmula de Haversine para calcular la distancia entre dos puntos geográficos (en kilómetros).
 * 
 * @param lat1 - Latitud del primer punto.
 * @param lon1 - Longitud del primer punto.
 * @param lat2 - Latitud del segundo punto.
 * @param lon2 - Longitud del segundo punto.
 * @returns La distancia en kilómetros entre los dos puntos.
 */
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radio de la Tierra en kilómetros
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

/**
 * Endpoint para obtener negocios cercanos al usuario autenticado.
 * 
 * Este endpoint calcula la distancia entre la ubicación del usuario y los negocios disponibles,
 * y devuelve una lista de negocios cercanos ordenados por distancia.
 */
export async function GET() {
  /**
   * Obtiene la sesión del usuario autenticado.
   * 
   * @returns La sesión del usuario o una respuesta de error si no está autenticado.
   */
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  /**
   * Obtiene la ubicación del usuario desde la base de datos.
   * 
   * @returns Un objeto con la latitud y longitud del usuario o una respuesta de error si no están disponibles.
   */
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

  /**
   * Obtiene todos los negocios con coordenadas válidas desde la base de datos.
   * 
   * @returns Una lista de negocios con latitud y longitud.
   */
  const negocios = await prisma.negocio.findMany({
    where: {
      latitud: { not: null },
      longitud: { not: null },
    },
  });

  /**
   * Calcula la distancia entre el usuario y cada negocio.
   * 
   * @returns Una lista de negocios con la distancia calculada.
   */
  const negociosConDistancia = negocios.map((n) => {
    const distancia = getDistanceKm(
      usuario.latitud!,
      usuario.longitud!,
      n.latitud!,
      n.longitud!
    );
    return { ...n, distancia };
  });

  /**
   * Filtra los negocios cercanos (a menos de 50 km) y los ordena por distancia.
   * 
   * @returns Una lista de negocios cercanos ordenados por distancia.
   */
  const negociosCercanos = negociosConDistancia
    .filter((n) => n.distancia <= 50) // ← filtro de cercanía
    .sort((a, b) => a.distancia - b.distancia);

  /**
   * Devuelve una respuesta HTTP con la lista de negocios cercanos.
   * 
   * @returns Una respuesta JSON con los negocios cercanos.
   */
  return NextResponse.json(negociosCercanos);
}