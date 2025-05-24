import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//Endpoint para verificar la disponibilidad de un servicio en una fecha específica
export async function POST(req: Request) {
  try {
    const { servicioId, fecha } = await req.json();

    if (!servicioId || !fecha) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    // Buscar reservas para ese día y servicio
    const fechaInicio = new Date(`${fecha}T00:00:00`);
    const fechaFin = new Date(`${fecha}T23:59:59`);

    const reservas = await prisma.reserva.findMany({
      where: {
        servicioId,
        fechaHora: {
          gte: fechaInicio,
          lte: fechaFin,
        },
      },
      select: {
        fechaHora: true,
      },
    });

    const horasOcupadas = reservas.map(r =>
      r.fechaHora.toTimeString().slice(0, 5)
    );

    return NextResponse.json({ horasOcupadas });
  } catch (error) {
    console.error("Error en disponibilidad:", error);
    return NextResponse.json({ message: "Error al obtener disponibilidad" }, { status: 500 });
  }
}