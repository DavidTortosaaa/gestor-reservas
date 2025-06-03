import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//Endpoint para verificar la disponibilidad de un servicio en una fecha específica
export async function POST(req: Request) {
  try {
    const { servicioId, fecha } = await req.json();

    if (!servicioId || !fecha) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioId },
    });

    if (!servicio) {
      return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
    }

    const duracionMs = servicio.duracion * 60 * 1000;

    const fechaInicio = new Date(`${fecha}T00:00:00`);
    const fechaFin = new Date(`${fecha}T23:59:59`);

    const reservas = await prisma.reserva.findMany({
      where: {
        servicioId,
        fechaHora: {
          gte: fechaInicio,
          lte: fechaFin,
        },
        estado: {
          not: "cancelada",
        },
      },
      select: {
        fechaHora: true,
      },
    });

    const horasOcupadas: string[] = [];

    reservas.forEach((r) => {
      const inicio = new Date(r.fechaHora);
      const fin = new Date(inicio.getTime() + duracionMs);

      // Bloquea cada intervalo de 5 minutos dentro del rango reservado
      for (let t = inicio.getTime(); t < fin.getTime(); t += 5 * 60 * 1000) {
        const hora = new Date(t).toTimeString().slice(0, 5);
        if (!horasOcupadas.includes(hora)) {
          horasOcupadas.push(hora);
        }
      }
    });

    return NextResponse.json({ horasOcupadas });
  } catch (error) {
    console.error("Error en disponibilidad:", error);
    return NextResponse.json({ message: "Error al obtener disponibilidad" }, { status: 500 });
  }
}