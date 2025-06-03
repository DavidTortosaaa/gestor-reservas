import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { enviarCorreo } from "@/lib/mailer";

//Endpoint para confirmar o cancelar una reserva
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const accion = formData.get("accion");

  if (!accion || (accion !== "confirmar" && accion !== "cancelar")) {
    return NextResponse.json({ message: "Acción inválida" }, { status: 400 });
  }

  const user = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

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

  const nuevoEstado = accion === "confirmar" ? "confirmada" : "cancelada";

  const nuevaReserva = await prisma.reserva.update({
    where: { id: params.id },
    data: {
      estado: nuevoEstado,
    },
  });

  // Enviar notificación al cliente
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

// PATCH: Cliente cancela su propia reserva
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { nuevoEstado } = await req.json();
  if (nuevoEstado !== "cancelada") {
    return NextResponse.json({ message: "Solo se permite cancelar" }, { status: 400 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  const reserva = await prisma.reserva.findUnique({
    where: { id: params.id },
  });

  if (!reserva || reserva.clienteId !== usuario?.id) {
    return NextResponse.json({ message: "No autorizado para cancelar esta reserva" }, { status: 403 });
  }

  if (new Date(reserva.fechaHora) <= new Date()) {
    return NextResponse.json({ message: "No se puede cancelar una reserva pasada" }, { status: 400 });
  }

  const actualizada = await prisma.reserva.update({
    where: { id: params.id },
    data: { estado: "cancelada" },
  });

  return NextResponse.json({ message: "Reserva cancelada", reserva: actualizada });
}