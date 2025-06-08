import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * Extrae el ID del servicio desde la URL.
 * 
 * @param req - Solicitud HTTP.
 * @returns El ID del servicio si está presente en la URL, o `null` si no se encuentra.
 */
function extraerIdDesdeUrl(req: Request): string | null {
  const match = req.url.match(/\/api\/servicios\/([^/]+)/);
  return match ? match[1] : null;
}

/**
 * Endpoint para actualizar un servicio.
 * 
 * Este endpoint permite al propietario de un negocio actualizar los datos de un servicio.
 * Valida la autenticación del usuario y verifica que sea el propietario del negocio asociado al servicio.
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
   * Extrae el ID del servicio desde la URL.
   * 
   * @returns Una respuesta de error si el ID no es válido.
   */
  const id = extraerIdDesdeUrl(req);
  if (!id) {
    return NextResponse.json({ message: "ID inválido en la URL" }, { status: 400 });
  }

  /**
   * Busca el servicio en la base de datos e incluye información del propietario del negocio.
   */
  const servicio = await prisma.servicio.findUnique({
    where: { id },
    include: {
      negocio: {
        select: { propietario: true },
      },
    },
  });

  /**
   * Verifica que el servicio exista y que el usuario autenticado sea el propietario del negocio.
   */
  if (!servicio || servicio.negocio.propietario.email !== session.user.email) {
    return NextResponse.json({ message: "No autorizado para editar este servicio" }, { status: 403 });
  }

  try {
    /**
     * Obtiene los datos enviados en la solicitud.
     * 
     * @returns Un objeto con los datos actualizados del servicio.
     */
    const { nombre, descripcion, duracion, precio } = await req.json();

    /**
     * Actualiza los datos del servicio en la base de datos.
     * 
     * @returns El objeto del servicio actualizado.
     */
    const actualizado = await prisma.servicio.update({
      where: { id },
      data: { nombre, descripcion, duracion, precio },
    });

    return NextResponse.json(actualizado);
  } catch (error) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     */
    console.error("Error actualizando servicio:", error);
    return NextResponse.json({ message: "Error actualizando servicio" }, { status: 500 });
  }
}

/**
 * Endpoint para eliminar un servicio.
 * 
 * Este endpoint permite al propietario de un negocio eliminar un servicio.
 * Valida la autenticación del usuario y verifica que sea el propietario del negocio asociado al servicio.
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
   * Extrae el ID del servicio desde la URL.
   * 
   * @returns Una respuesta de error si el ID no es válido.
   */
  const id = extraerIdDesdeUrl(req);
  if (!id) {
    return NextResponse.json({ message: "ID inválido en la URL" }, { status: 400 });
  }

  /**
   * Busca el servicio en la base de datos e incluye información del propietario del negocio.
   */
  const servicio = await prisma.servicio.findUnique({
    where: { id },
    include: {
      negocio: {
        select: { propietario: true },
      },
    },
  });

  /**
   * Verifica que el servicio exista y que el usuario autenticado sea el propietario del negocio.
   */
  if (!servicio || servicio.negocio.propietario.email !== session.user.email) {
    return NextResponse.json({ message: "No autorizado para eliminar este servicio" }, { status: 403 });
  }

  try {
    /**
     * Elimina el servicio de la base de datos.
     */
    await prisma.servicio.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Servicio eliminado" });
  } catch (error) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     */
    console.error("Error eliminando servicio:", error);
    return NextResponse.json({ message: "Error eliminando servicio" }, { status: 500 });
  }
}
