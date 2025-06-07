import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

/**
 * Endpoint para crear un nuevo negocio.
 * 
 * Este endpoint permite a los usuarios autenticados crear un negocio asociado a su cuenta.
 */
export async function POST(req: Request) {
  /**
   * Obtiene la sesión del usuario autenticado.
   * 
   * @returns La sesión del usuario o una respuesta de error si no está autenticado.
   */
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 })
  }

  /**
   * Extrae los datos enviados en la solicitud.
   * 
   * @param req - Solicitud HTTP con los datos del negocio.
   * @returns Un objeto con los datos del negocio: nombre, email, teléfono, dirección, latitud, longitud, horario de apertura y cierre.
   */
  const data = await req.json()

  /**
   * Busca al propietario en la base de datos utilizando el email de la sesión.
   * 
   * @returns El objeto del propietario o una respuesta de error si no se encuentra.
   */
  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email }
  })

  if (!propietario) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
  }

  try {
    /**
     * Crea un nuevo negocio en la base de datos.
     * 
     * @returns El objeto del negocio recién creado.
     */
    const nuevoNegocio = await prisma.negocio.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        latitud: data.latitud,
        longitud: data.longitud,
        horario_apertura: data.horario_apertura,
        horario_cierre: data.horario_cierre,
        propietarioId: propietario.id
      }
    })

    /**
     * Devuelve una respuesta HTTP con los datos del negocio creado.
     * 
     * @returns Una respuesta JSON con el objeto del negocio.
     */
    return NextResponse.json(nuevoNegocio)
  } catch (error: any) {
    /**
     * Manejo de errores.
     * Devuelve una respuesta HTTP con el mensaje de error y el código de estado 500.
     * 
     * @returns Una respuesta JSON con el mensaje de error.
     */
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}