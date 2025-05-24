import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// POST: Crear nueva reserva
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    const { servicioId, fechaHora, estado } = await req.json();

    if (!servicioId || !fechaHora) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    const fechaReserva = new Date(fechaHora);
    const ahora = new Date();

    if (fechaReserva <= ahora) {
      return NextResponse.json(
        { message: "No se puede crear una reserva en el pasado" },
        { status: 400 }
      );
    }

    const inicio = new Date(fechaHora);
    const fin = new Date(inicio.getTime() + 59 * 60 * 1000); // margen de 59 mins

    const conflicto = await prisma.reserva.findFirst({
      where: {
        servicioId,
        fechaHora: {
          gte: inicio,
          lte: fin,
        },
      },
    });

    if (conflicto) {
      return NextResponse.json({ message: "Esa hora ya está reservada" }, { status: 409 });
    }

    const reserva = await prisma.reserva.create({
      data: {
        servicioId,
        clienteId: user.id,
        fechaHora: new Date(fechaHora),
        estado: estado || "pendiente",
      },
    });

    return NextResponse.json(reserva);
  } catch (error) {
    console.error("Error creando reserva:", error);
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}

// GET: Obtener reservas del usuario autenticado
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const user = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    await prisma.reserva.deleteMany({
      where: {
        clienteId: user.id,
        fechaHora: { lt: new Date() },
        estado: { in: ["pendiente", "cancelada"] },
      },
    });

    const reservas = await prisma.reserva.findMany({
      where: {
        clienteId: user.id,
      },
      include: {
        servicio: {
          include: {
            negocio: true,
          },
        },
      },
      orderBy: {
        fechaHora: "asc",
      },
    });

    return NextResponse.json(reservas, { status: 200 });
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    return NextResponse.json({ message: "Error interno al obtener reservas" }, { status: 500 });
  }
}