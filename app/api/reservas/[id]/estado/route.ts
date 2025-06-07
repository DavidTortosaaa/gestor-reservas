import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { enviarCorreo } from "@/lib/mailer";

/**
 * Endpoint para confirmar o cancelar una reserva.
 * 
 * Este endpoint permite al propietario de un negocio confirmar o cancelar una reserva.
 */
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
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
   * Extrae la acción enviada en el formulario.
   * 
   * @param req - Solicitud HTTP con los datos del formulario.
   * @returns La acción a realizar: "confirmar" o "cancelar".
   */
  const formData = await req.formData();
  const accion = formData.get("accion");

  if (!accion || (accion !== "confirmar" && accion !== "cancelar")) {
    return NextResponse.json({ message: "Acción inválida" }, { status: 400 });
  }

  /**
   * Busca al usuario autenticado en la base de datos.
   * 
   * @returns El objeto del usuario o una respuesta de error si no se encuentra.
   */
  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Busca la reserva en la base de datos.
   * 
   * @returns El objeto de la reserva o una respuesta de error si no se encuentra.
   */
  const reserva = await prisma.reserva.findUnique({
    where: { id: params.id },
    include: {
      cliente: true,
      servicio: {
        include: {
          negocio: true,
        },
      },
    },
  });

  if (!reserva || reserva.servicio.negocio.propietarioId !== user?.id) {
    return NextResponse.json({ message: "No autorizado para esta acción" }, { status: 403 });
  }

  /**
   * Actualiza el estado de la reserva.
   * 
   * @returns El objeto de la reserva con el estado actualizado.
   */
  const nuevoEstado = accion === "confirmar" ? "confirmada" : "cancelada";

  const nuevaReserva = await prisma.reserva.update({
    where: { id: params.id },
    data: {
      estado: nuevoEstado,
    },
  });

  /**
   * Envía una notificación por correo al cliente.
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

  /**
   * Devuelve una respuesta HTTP con el estado actualizado.
   * 
   * @returns Una respuesta JSON con el nuevo estado de la reserva.
   */
  return NextResponse.json({
    message: "Estado actualizado",
    estado: nuevaReserva.estado,
  });
}

/**
 * Endpoint para que el cliente cancele su propia reserva.
 * 
 * Este endpoint permite a los clientes cancelar sus reservas futuras.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
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
   * Extrae el nuevo estado enviado en la solicitud.
   * 
   * @param req - Solicitud HTTP con los datos del estado.
   * @returns El nuevo estado de la reserva.
   */
  const { nuevoEstado } = await req.json();
  if (nuevoEstado !== "cancelada") {
    return NextResponse.json({ message: "Solo se permite cancelar" }, { status: 400 });
  }

  /**
   * Busca al usuario autenticado en la base de datos.
   * 
   * @returns El objeto del usuario o una respuesta de error si no se encuentra.
   */
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Busca la reserva en la base de datos.
   * 
   * @returns El objeto de la reserva o una respuesta de error si no se encuentra.
   */
  const reserva = await prisma.reserva.findUnique({
    where: { id: params.id },
  });

  if (!reserva || reserva.clienteId !== usuario?.id) {
    return NextResponse.json({ message: "No autorizado para cancelar esta reserva" }, { status: 403 });
  }

  /**
   * Valida que la reserva no sea en el pasado.
   */
  if (new Date(reserva.fechaHora) <= new Date()) {
    return NextResponse.json({ message: "No se puede cancelar una reserva pasada" }, { status: 400 });
  }

  /**
   * Actualiza el estado de la reserva a "cancelada".
   * 
   * @returns El objeto de la reserva con el estado actualizado.
   */
  const actualizada = await prisma.reserva.update({
    where: { id: params.id },
    data: { estado: "cancelada" },
  });

  /**
   * Devuelve una respuesta HTTP con la reserva cancelada.
   * 
   * @returns Una respuesta JSON con el objeto de la reserva actualizada.
   */
  return NextResponse.json({ message: "Reserva cancelada", reserva: actualizada });
}