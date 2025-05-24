import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

//Endpoint para confirmar o cancelar una reserva
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  // Comprobar que el usuario esté autenticado
  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const accion = formData.get("accion");

  if (!accion || (accion !== "confirmar" && accion !== "cancelar")) {
    return NextResponse.json({ message: "Acción inválida" }, { status: 400 });
  }

  // Buscar el usuario autenticado por su email
  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!propietario) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
  }

  // Buscar la reserva junto con su servicio y negocio
  const reserva = await prisma.reserva.findUnique({
    where: { id: params.id },
    include: {
      servicio: {
        include: {
          negocio: true,
        },
      },
    },
  });

  // Verificar que el negocio pertenezca al usuario
  if (!reserva || reserva.servicio.negocio.propietarioId !== propietario.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  // Actualizar el estado
  const nuevaReserva = await prisma.reserva.update({
    where: { id: params.id },
    data: {
      estado: accion === "confirmar" ? "confirmada" : "cancelada",
    },
  });

  return NextResponse.json({ message: "Estado actualizado", estado: nuevaReserva.estado });
}

// PATCH: Cliente cancela su propia reserva
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { nuevoEstado } = await req.json();

  if (nuevoEstado !== "cancelada") {
    return NextResponse.json({ message: "Solo se permite cancelar" }, { status: 400 });
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  if (!usuario) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
  }

  const reserva = await prisma.reserva.findUnique({
    where: { id: params.id },
  });

  if (!reserva || reserva.clienteId !== usuario.id) {
    return NextResponse.json({ message: "No autorizado para cancelar esta reserva" }, { status: 403 });
  }

  // Verificamos que la reserva no esté en el pasado
  if (new Date(reserva.fechaHora) <= new Date()) {
    return NextResponse.json({ message: "No se puede cancelar una reserva pasada" }, { status: 400 });
  }

  const actualizada = await prisma.reserva.update({
    where: { id: params.id },
    data: {
      estado: "cancelada",
    },
  });

  return NextResponse.json({ message: "Reserva cancelada", reserva: actualizada });
}