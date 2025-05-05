import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 👉 Actualizar un servicio (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { nombre, descripcion, duracion, precio } = body;

    const servicioActualizado = await prisma.servicio.update({
      where: { id: params.id },
      data: {
        nombre,
        descripcion,
        duracion,
        precio,
      },
    });

    return NextResponse.json(servicioActualizado);
  } catch (error) {
    console.error("Error actualizando servicio:", error);
    return NextResponse.json({ message: "Error actualizando servicio" }, { status: 500 });
  }
}

// 🗑️ Eliminar un servicio (DELETE)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
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