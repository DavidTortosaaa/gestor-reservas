import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint para actualizar un negocio.
 * 
 * Este endpoint permite a los propietarios de negocios actualizar la información de su negocio.
 * Solo el propietario del negocio puede realizar esta acción.
 */
export async function PUT(
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
   * Extrae los datos enviados en la solicitud.
   * 
   * @param req - Solicitud HTTP con los datos del negocio.
   * @returns Un objeto con los datos actualizados del negocio.
   */
  const data = await req.json();

  /**
   * Busca al propietario en la base de datos utilizando el email de la sesión.
   * 
   * @returns El objeto del propietario o una respuesta de error si no se encuentra.
   */
  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Verifica si el negocio pertenece al propietario autenticado.
   * 
   * @returns El objeto del negocio o una respuesta de error si no pertenece al propietario.
   */
  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
      propietarioId: propietario?.id,
    },
  });

  if (!negocio) {
    return NextResponse.json({ message: "No autorizado para editar este negocio" }, { status: 403 });
  }

  /**
   * Actualiza la información del negocio en la base de datos.
   * 
   * @returns El objeto del negocio actualizado.
   */
  const negocioActualizado = await prisma.negocio.update({
    where: { id: params.id },
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

  /**
   * Devuelve una respuesta HTTP con los datos del negocio actualizado.
   * 
   * @returns Una respuesta JSON con el objeto del negocio actualizado.
   */
  return NextResponse.json(negocioActualizado);
}

/**
 * Endpoint para eliminar un negocio.
 * 
 * Este endpoint permite a los propietarios de negocios eliminar su negocio.
 * Solo el propietario del negocio puede realizar esta acción.
 */
export async function DELETE(
  _req: Request,
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
   * Busca al propietario en la base de datos utilizando el email de la sesión.
   * 
   * @returns El objeto del propietario o una respuesta de error si no se encuentra.
   */
  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
  });

  /**
   * Verifica si el negocio pertenece al propietario autenticado.
   * 
   * @returns El objeto del negocio o una respuesta de error si no pertenece al propietario.
   */
  const negocio = await prisma.negocio.findFirst({
    where: {
      id: params.id,
      propietarioId: propietario?.id,
    },
  });

  if (!negocio) {
    return NextResponse.json({ message: "No autorizado para eliminar este negocio" }, { status: 403 });
  }

  try {
    /**
     * Elimina el negocio de la base de datos.
     * 
     * @returns Una respuesta HTTP indicando que el negocio fue eliminado.
     */
    await prisma.negocio.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Negocio eliminado" });
  } catch (error: any) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     * 
     * @returns Una respuesta JSON con el mensaje de error.
     */
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
