import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * Endpoint para actualizar un servicio.
 * 
 * Este endpoint permite a los propietarios de negocios actualizar los detalles de un servicio.
 * Valida que el servicio pertenezca al negocio del usuario autenticado antes de permitir la actualización.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
   * Busca el servicio en la base de datos y verifica que pertenezca al negocio del usuario autenticado.
   * 
   * @returns El objeto del servicio o una respuesta de error si no pertenece al usuario.
   */
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
    /**
     * Extrae los datos enviados en la solicitud.
     * 
     * @param req - Solicitud HTTP con los datos del servicio.
     * @returns Un objeto con los datos actualizados del servicio: nombre, descripción, duración y precio.
     */
    const { nombre, descripcion, duracion, precio } = await req.json();

    /**
     * Actualiza el servicio en la base de datos.
     * 
     * @returns El objeto del servicio actualizado.
     */
    const actualizado = await prisma.servicio.update({
      where: { id: params.id },
      data: { nombre, descripcion, duracion, precio },
    });

    /**
     * Devuelve una respuesta HTTP con los datos del servicio actualizado.
     * 
     * @returns Una respuesta JSON con el objeto del servicio actualizado.
     */
    return NextResponse.json(actualizado);
  } catch (error) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     * 
     * @returns Una respuesta JSON con el mensaje de error.
     */
    console.error("Error actualizando servicio:", error);
    return NextResponse.json({ message: "Error actualizando servicio" }, { status: 500 });
  }
}

/**
 * Endpoint para eliminar un servicio.
 * 
 * Este endpoint permite a los propietarios de negocios eliminar un servicio asociado a su negocio.
 * Valida que el servicio pertenezca al negocio del usuario autenticado antes de permitir la eliminación.
 */
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
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
   * Busca el servicio en la base de datos y verifica que pertenezca al negocio del usuario autenticado.
   * 
   * @returns El objeto del servicio o una respuesta de error si no pertenece al usuario.
   */
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
    /**
     * Elimina el servicio de la base de datos.
     * 
     * @returns Una respuesta HTTP indicando que el servicio fue eliminado.
     */
    await prisma.servicio.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Servicio eliminado" });
  } catch (error) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     * 
     * @returns Una respuesta JSON con el mensaje de error.
     */
    console.error("Error eliminando servicio:", error);
    return NextResponse.json({ message: "Error eliminando servicio" }, { status: 500 });
  }
}