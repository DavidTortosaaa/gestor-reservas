import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * Endpoint para crear un nuevo servicio.
 * 
 * Este endpoint permite a los propietarios de negocios crear servicios asociados a sus negocios.
 * Valida que el negocio pertenezca al usuario autenticado antes de permitir la creación del servicio.
 */
export async function POST(req: Request) {
  /**
   * Obtiene la sesión del usuario autenticado.
   * 
   * @returns La sesión del usuario o una respuesta de error si no está autenticado.
   */
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  /**
   * Extrae los datos enviados en la solicitud.
   * 
   * @param req - Solicitud HTTP con los datos del servicio.
   * @returns Un objeto con los datos del servicio: nombre, duración, precio, descripción y negocioId.
   */
  const data = await req.json();

  if (!data.nombre || !data.duracion || !data.precio || !data.negocioId) {
    return NextResponse.json({ message: "Datos incompletos" }, { status: 400 });
  }

  try {
    /**
     * Verifica que el negocio pertenezca al usuario autenticado.
     * 
     * @returns El objeto del negocio o una respuesta de error si no pertenece al usuario.
     */
    const negocio = await prisma.negocio.findFirst({
      where: {
        id: data.negocioId,
        propietario: {
          email: session.user.email,
        },
      },
    });

    if (!negocio) {
      return NextResponse.json({ message: "No tienes permiso sobre este negocio" }, { status: 403 });
    }

    /**
     * Crea el servicio en la base de datos.
     * 
     * @returns El objeto del servicio recién creado.
     */
    const nuevoServicio = await prisma.servicio.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        duracion: data.duracion,
        precio: data.precio,
        negocioId: negocio.id,
      },
    });

    /**
     * Devuelve una respuesta HTTP con los datos del servicio creado.
     * 
     * @returns Una respuesta JSON con el objeto del servicio.
     */
    return NextResponse.json(nuevoServicio);
  } catch (error: any) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     * 
     * @returns Una respuesta JSON con el mensaje de error.
     */
    console.error(error);
    return NextResponse.json({ message: "Error al crear servicio" }, { status: 500 });
  }
}