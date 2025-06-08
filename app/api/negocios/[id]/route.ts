import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

// ✅ Utilidad para extraer ID de la ruta
function extraerIdDesdeUrl(req: Request): string | null {
  const match = req.url.match(/\/api\/negocios\/([^/]+)/);
  return match ? match[1] : null;
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const id = extraerIdDesdeUrl(req);
  if (!id) {
    return NextResponse.json({ message: "ID inválido en la URL" }, { status: 400 });
  }

  const data = await req.json();
  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  const negocio = await prisma.negocio.findFirst({
    where: {
      id,
      propietarioId: propietario?.id,
    },
  });

  if (!negocio) {
    return NextResponse.json({ message: "No autorizado para editar este negocio" }, { status: 403 });
  }

  const negocioActualizado = await prisma.negocio.update({
    where: { id },
    data: {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      latitud: data.latitud,
      longitud: data.longitud,
      horario_apertura: data.horario_apertura,
      horario_cierre: data.horario_cierre,
    },
  });

  return NextResponse.json(negocioActualizado);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const id = extraerIdDesdeUrl(req);
  if (!id) {
    return NextResponse.json({ message: "ID inválido en la URL" }, { status: 400 });
  }

  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  const negocio = await prisma.negocio.findFirst({
    where: {
      id,
      propietarioId: propietario?.id,
    },
  });

  if (!negocio) {
    return NextResponse.json({ message: "No autorizado para eliminar este negocio" }, { status: 403 });
  }

  try {
    await prisma.negocio.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Negocio eliminado" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
