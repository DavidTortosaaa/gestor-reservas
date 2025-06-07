import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint para verificar la disponibilidad de un servicio en una fecha específica.
 * 
 * Este endpoint devuelve las horas ocupadas para un servicio en una fecha dada,
 * bloqueando intervalos de tiempo según la duración del servicio.
 */
export async function POST(req: Request) {
  try {
    /**
     * Extrae los datos enviados en la solicitud.
     * 
     * @param req - Solicitud HTTP con los datos del servicio y la fecha.
     * @returns Un objeto con el ID del servicio y la fecha.
     */
    const { servicioId, fecha } = await req.json();

    if (!servicioId || !fecha) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    /**
     * Busca el servicio en la base de datos.
     * 
     * @returns El objeto del servicio o una respuesta de error si no se encuentra.
     */
    const servicio = await prisma.servicio.findUnique({
      where: { id: servicioId },
    });

    if (!servicio) {
      return NextResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
    }

    /**
     * Calcula la duración del servicio en milisegundos.
     */
    const duracionMs = servicio.duracion * 60 * 1000;

    /**
     * Define el rango de tiempo para la fecha especificada.
     * 
     * @returns Dos objetos Date que representan el inicio y fin del día.
     */
    const fechaInicio = new Date(`${fecha}T00:00:00`);
    const fechaFin = new Date(`${fecha}T23:59:59`);

    /**
     * Obtiene las reservas del servicio en la fecha especificada.
     * 
     * @returns Una lista de objetos con las horas reservadas.
     */
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

    /**
     * Calcula las horas ocupadas bloqueando intervalos de tiempo según la duración del servicio.
     * 
     * @returns Un array de strings con las horas ocupadas en formato HH:mm.
     */
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

    /**
     * Devuelve una respuesta HTTP con las horas ocupadas.
     * 
     * @returns Una respuesta JSON con las horas ocupadas.
     */
    return NextResponse.json({ horasOcupadas });
  } catch (error) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     * 
     * @returns Una respuesta JSON con el mensaje de error.
     */
    console.error("Error en disponibilidad:", error);
    return NextResponse.json({ message: "Error al obtener disponibilidad" }, { status: 500 });
  }
}