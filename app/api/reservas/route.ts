import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { enviarCorreo } from "@/lib/mailer";

/**
 * Endpoint para crear una nueva reserva.
 * 
 * Este endpoint permite a los usuarios autenticados crear una reserva para un servicio.
 * Valida la disponibilidad del servicio, la fecha y hora, y envía una notificación al propietario del negocio.
 */
export async function POST(req: Request) {
  try {
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
     * Busca al usuario en la base de datos utilizando el email de la sesión.
     * 
     * @returns El objeto del usuario o una respuesta de error si no se encuentra.
     */
    const user = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    /**
     * Extrae los datos enviados en la solicitud.
     * 
     * @param req - Solicitud HTTP con los datos de la reserva.
     * @returns Un objeto con el ID del servicio, la fecha y hora, y el estado de la reserva.
     */
    const { servicioId, fechaHora, estado } = await req.json();
    if (!servicioId || !fechaHora) {
      return NextResponse.json({ message: "Faltan datos" }, { status: 400 });
    }

    /**
     * Valida que la fecha de la reserva no sea en fines de semana ni en el pasado.
     */
    const fechaReserva = new Date(fechaHora);

    const fechaLocal = new Date(
      fechaReserva.getFullYear(),
      fechaReserva.getMonth(),
      fechaReserva.getDate(),
      fechaReserva.getHours(),
      fechaReserva.getMinutes(),
      0
    );

    const diaSemana = fechaLocal.getDay();
    if (diaSemana === 0 || diaSemana === 6) {
      return NextResponse.json(
        { message: "No se pueden hacer reservas en fines de semana" },
        { status: 400 }
      );
    }

    const ahora = new Date();
    if (fechaLocal <= ahora) {
      return NextResponse.json({ message: "No se puede crear una reserva en el pasado" }, { status: 400 });
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
     * Calcula la duración del servicio y verifica conflictos de horario.
     */
    const duracionMs = servicio.duracion * 60 * 1000;
    const inicio = new Date(fechaHora);
    const fin = new Date(inicio.getTime() + duracionMs);

    const conflicto = await prisma.reserva.findFirst({
      where: {
        servicioId,
        fechaHora: {
          gte: inicio,
          lt: fin,
        },
        estado: {
          not: "cancelada",
        },
      },
    });

    if (conflicto) {
      return NextResponse.json({ message: "Esa hora ya está reservada" }, { status: 409 });
    }

    /**
     * Crea la reserva en la base de datos.
     * 
     * @returns El objeto de la reserva recién creada.
     */
    const reserva = await prisma.reserva.create({
      data: {
        servicioId,
        clienteId: user.id,
        fechaHora: fechaReserva,
        estado: estado || "pendiente",
      },
      include: {
        servicio: {
          include: {
            negocio: {
              include: {
                propietario: true,
              },
            },
          },
        },
      },
    });

    /**
     * Envía una notificación por correo al propietario del negocio.
     */
    const propietario = reserva.servicio.negocio.propietario;

    if (propietario?.email) {
      await enviarCorreo({
        to: propietario.email,
        subject: "Nueva reserva recibida",
        html: `
          <h2>Tienes una nueva reserva</h2>
          <p><strong>Cliente:</strong> ${user.nombre}</p>
          <p><strong>Servicio:</strong> ${reserva.servicio.nombre}</p>
          <p><strong>Fecha:</strong> ${fechaReserva.toLocaleString()}</p>
          <p>Por favor, confirma o cancela la reserva desde el panel de administración.</p>
        `,
      });
    }

    return NextResponse.json(reserva);
  } catch (error) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     * 
     * @returns Una respuesta JSON con el mensaje de error.
     */
    console.error("Error creando reserva:", error);
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}

/**
 * Endpoint para obtener las reservas del usuario autenticado.
 * 
 * Este endpoint devuelve una lista de reservas asociadas al usuario autenticado.
 */
export async function GET() {
  try {
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
     * Busca al usuario en la base de datos utilizando el email de la sesión.
     * 
     * @returns El objeto del usuario o una respuesta de error si no se encuentra.
     */
    const user = await prisma.usuario.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    /**
     * Elimina reservas pasadas que estén pendientes o canceladas.
     */
    await prisma.reserva.deleteMany({
      where: {
        clienteId: user.id,
        fechaHora: { lt: new Date() },
        estado: { in: ["pendiente", "cancelada"] },
      },
    });

    /**
     * Obtiene las reservas del usuario ordenadas por fecha.
     * 
     * @returns Una lista de reservas asociadas al usuario.
     */
    const reservas = await prisma.reserva.findMany({
      where: { clienteId: user.id },
      include: {
        servicio: {
          include: { negocio: true },
        },
      },
      orderBy: { fechaHora: "asc" },
    });

    return NextResponse.json(reservas);
  } catch (error) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     * 
     * @returns Una respuesta JSON con el mensaje de error.
     */
    console.error("Error al obtener reservas:", error);
    return NextResponse.json({ message: "Error interno al obtener reservas" }, { status: 500 });
  }
}