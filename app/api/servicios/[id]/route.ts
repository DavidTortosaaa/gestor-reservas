import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// 👉 Actualizar un servicio (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const servicio = await prisma.servicio.findUnique({
    where: { id: params.id },
    include: {
      negocio: {
        select: { propietario: true },
      },
    },
  });

  if (!servicio || servicio.negocio.propietario.email !== session.user.email) {
    return NextResponse.json({ message: "No autorizado para editar este servicio" }, { status: 403 });
  }

  try {
    const { nombre, descripcion, duracion, precio } = await req.json();

    const actualizado = await prisma.servicio.update({
      where: { id: params.id },
      data: { nombre, descripcion, duracion, precio },
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error("Error actualizando servicio:", error);
    return NextResponse.json({ message: "Error actualizando servicio" }, { status: 500 });
  }
}

// 🗑️ Eliminar un servicio (DELETE)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const servicio = await prisma.servicio.findUnique({
    where: { id: params.id },
    include: {
      negocio: {
        select: { propietario: true },
      },
    },
  });

  if (!servicio || servicio.negocio.propietario.email !== session.user.email) {
    return NextResponse.json({ message: "No autorizado para eliminar este servicio" }, { status: 403 });
  }

  try {
    await prisma.servicio.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Servicio eliminado" });
  } catch (error) {
    console.error("Error eliminando servicio:", error);
    return NextResponse.json({ message: "Error eliminando servicio" }, { status: 500 });
  }
}