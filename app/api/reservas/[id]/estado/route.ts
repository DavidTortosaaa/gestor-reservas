import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { enviarCorreo } from "@/lib/mailer";

/**
 * Utilidad para extraer el ID de la reserva desde la URL.
 * 
 * @param req - Solicitud HTTP.
 * @returns El ID de la reserva si está presente en la URL, o `null` si no se encuentra.
 */
function extraerIdDesdeUrl(req: Request): string | null {
  const match = req.url.match(/\/api\/reservas\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * Endpoint para que el propietario confirme o cancele una reserva.
 * 
 * Este endpoint permite al propietario de un negocio cambiar el estado de una reserva.
 * Envía una notificación por correo al cliente sobre el cambio de estado.
 */
export async function POST(req: Request) {
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
   * Extrae el ID de la reserva desde la URL.
   * 
   * @returns Una respuesta de error si el ID no es válido.
   */
  const id = extraerIdDesdeUrl(req);
  if (!id) {
    return NextResponse.json({ message: "ID inválido en la URL" }, { status: 400 });
  }

  /**
   * Obtiene los datos enviados en la solicitud.
   * 
   * @returns La acción a realizar (confirmar o cancelar).
   */
  const formData = await req.formData();
  const accion = formData.get("accion");

  if (!accion || (accion !== "confirmar" && accion !== "cancelar")) {
    return NextResponse.json({ message: "Acción inválida" }, { status: 400 });
  }

  /**
   * Busca al usuario autenticado en la base de datos.
   */
  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Busca la reserva en la base de datos e incluye información del cliente y del negocio.
   */
  const reserva = await prisma.reserva.findUnique({
    where: { id },
    include: {
      cliente: true,
      servicio: {
        include: {
          negocio: true,
        },
      },
    },
  });

  /**
   * Verifica que la reserva exista y que el usuario autenticado sea el propietario del negocio.
   */
  if (!reserva || reserva.servicio.negocio.propietarioId !== user?.id) {
    return NextResponse.json({ message: "No autorizado para esta acción" }, { status: 403 });
  }

  /**
   * Actualiza el estado de la reserva en la base de datos.
   * 
   * @returns El nuevo estado de la reserva.
   */
  const nuevoEstado = accion === "confirmar" ? "confirmada" : "cancelada";

  const nuevaReserva = await prisma.reserva.update({
    where: { id },
    data: {
      estado: nuevoEstado,
    },
  });

  /**
   * Envía una notificación por correo al cliente sobre el cambio de estado.
   */
  if (reserva.cliente?.email) {
    const asunto =
      nuevoEstado === "confirmada"
        ? "Tu reserva ha sido confirmada"
        : "Tu reserva ha sido cancelada";

    const mensaje =
      nuevoEstado === "confirmada"
        ? `<p>Tu reserva para <strong>${reserva.servicio.nombre}</strong> en <strong>${reserva.servicio.negocio.nombre}</strong> ha sido <strong>confirmada</strong>.</p>`
        : `<p>Tu reserva para <strong>${reserva.servicio.nombre}</strong> en <strong>${reserva.servicio.negocio.nombre}</strong> ha sido <strong>cancelada</strong>.</p>`;

    await enviarCorreo({
      to: reserva.cliente.email,
      subject: asunto,
      html: `
        <h2>${asunto}</h2>
        ${mensaje}
        <p><strong>Fecha:</strong> ${new Date(reserva.fechaHora).toLocaleString()}</p>
      `,
    });
  }

  return NextResponse.json({
    message: "Estado actualizado",
    estado: nuevaReserva.estado,
  });
}

/**
 * Endpoint para que el cliente cancele su propia reserva.
 * 
 * Este endpoint permite al cliente cancelar una reserva futura.
 */
export async function PATCH(req: Request) {
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
   * Extrae el ID de la reserva desde la URL.
   * 
   * @returns Una respuesta de error si el ID no es válido.
   */
  const id = extraerIdDesdeUrl(req);
  if (!id) {
    return NextResponse.json({ message: "ID inválido en la URL" }, { status: 400 });
  }

  /**
   * Obtiene los datos enviados en la solicitud.
   * 
   * @returns El nuevo estado de la reserva.
   */
  const { nuevoEstado } = await req.json();
  if (nuevoEstado !== "cancelada") {
    return NextResponse.json({ message: "Solo se permite cancelar" }, { status: 400 });
  }

  /**
   * Busca al usuario autenticado en la base de datos.
   */
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Busca la reserva en la base de datos.
   */
  const reserva = await prisma.reserva.findUnique({
    where: { id },
  });

  /**
   * Verifica que la reserva exista y que el usuario autenticado sea el cliente.
   */
  if (!reserva || reserva.clienteId !== usuario?.id) {
    return NextResponse.json({ message: "No autorizado para cancelar esta reserva" }, { status: 403 });
  }

  /**
   * Verifica que la reserva no sea pasada.
   */
  if (new Date(reserva.fechaHora) <= new Date()) {
    return NextResponse.json({ message: "No se puede cancelar una reserva pasada" }, { status: 400 });
  }

  /**
   * Actualiza el estado de la reserva en la base de datos.
   * 
   * @returns La reserva actualizada.
   */
  const actualizada = await prisma.reserva.update({
    where: { id },
    data: { estado: "cancelada" },
  });

  return NextResponse.json({ message: "Reserva cancelada", reserva: actualizada });
}
