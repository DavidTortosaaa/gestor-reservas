import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * Utilidad para extraer el ID del negocio desde la URL.
 * 
 * @param req - Solicitud HTTP.
 * @returns El ID del negocio si está presente en la URL, o `null` si no se encuentra.
 */
function extraerIdDesdeUrl(req: Request): string | null {
  const match = req.url.match(/\/api\/negocios\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * Endpoint para actualizar un negocio.
 * 
 * Este endpoint permite al propietario de un negocio actualizar sus datos.
 * Valida la autenticación del usuario y verifica que sea el propietario del negocio.
 */
export async function PUT(req: Request) {
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
   * Extrae el ID del negocio desde la URL.
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
   * @returns Un objeto con los datos del negocio.
   */
  const data = await req.json();

  /**
   * Busca al propietario del negocio en la base de datos utilizando el email de la sesión.
   */
  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Verifica que el negocio exista y que el usuario autenticado sea el propietario.
   */
  const negocio = await prisma.negocio.findFirst({
    where: {
      id,
      propietarioId: propietario?.id,
    },
  });

  if (!negocio) {
    return NextResponse.json({ message: "No autorizado para editar este negocio" }, { status: 403 });
  }

  /**
   * Actualiza los datos del negocio en la base de datos.
   * 
   * @returns El objeto del negocio actualizado.
   */
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

/**
 * Endpoint para eliminar un negocio.
 * 
 * Este endpoint permite al propietario de un negocio eliminarlo.
 * Valida la autenticación del usuario y verifica que sea el propietario del negocio.
 */
export async function DELETE(req: Request) {
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
   * Extrae el ID del negocio desde la URL.
   * 
   * @returns Una respuesta de error si el ID no es válido.
   */
  const id = extraerIdDesdeUrl(req);
  if (!id) {
    return NextResponse.json({ message: "ID inválido en la URL" }, { status: 400 });
  }

  /**
   * Busca al propietario del negocio en la base de datos utilizando el email de la sesión.
   */
  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Verifica que el negocio exista y que el usuario autenticado sea el propietario.
   */
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
    /**
     * Elimina el negocio de la base de datos.
     */
    await prisma.negocio.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Negocio eliminado" });
  } catch (error: any) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     */
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
