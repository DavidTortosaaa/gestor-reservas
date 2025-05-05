import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// Endpoint para actualizar un negocio
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const data = await req.json();

  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
      propietario: {
        email: session.user.email,
      },
    },
  });

  if (!negocio) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  const negocioActualizado = await prisma.negocio.update({
    where: { id: params.id },
    data: {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      horario_apertura: data.horario_apertura,
      horario_cierre: data.horario_cierre,
    },
  });

  return NextResponse.json(negocioActualizado);
}

// Endpoint para eliminar un negocio
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
      propietario: {
        email: session.user.email,
      },
    },
  });

  if (!negocio) {
    return NextResponse.json({ message: "No autorizado" }, { status: 403 });
  }

  try {
    await prisma.negocio.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Negocio eliminado" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
