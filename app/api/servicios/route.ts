import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const data = await req.json();

  if (!data.nombre || !data.duracion || !data.precio || !data.negocioId) {
    return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });
  }

  try {
    // Comprobamos que el negocio pertenezca al usuario
    const negocio = await prisma.negocio.findFirst({
      where: {
        id: data.negocioId,
        propietario: {
          email: session.user.email,
        },
      },
    });

    if (!negocio) {
      return NextResponse.json({ message: "No tienes permiso sobre este negocio" }, { status: 403 });
    }

    // Crear el servicio
    const nuevoServicio = await prisma.servicio.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        duracion: data.duracion,
        precio: data.precio,
        negocioId: negocio.id,
      },
    });

    return NextResponse.json(nuevoServicio);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: "Error al crear servicio" }, { status: 500 });
  }
}