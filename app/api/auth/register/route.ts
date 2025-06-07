import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

/**
 * Endpoint para el registro de usuarios.
 * 
 * Este endpoint permite crear un nuevo usuario en la base de datos.
 * Valida si el usuario ya existe y encripta la contraseña antes de guardarla.
 */
export async function POST(req: Request) {
  /**
   * Extrae los datos enviados en la solicitud.
   * 
   * @param req - Solicitud HTTP con los datos del usuario.
   * @returns Un objeto con los datos del usuario: nombre, email, password, teléfono, latitud, longitud y dirección.
   */
  const { nombre, email, password, telefono, latitud, longitud, direccion } = await req.json()

  /**
   * Verifica si el usuario ya existe en la base de datos.
   * 
   * @returns Una respuesta HTTP con un mensaje de error si el usuario ya existe.
   */
  const userExists = await prisma.usuario.findUnique({
    where: { email },
  })

  if (userExists) {
    return NextResponse.json({ message: "El usuario ya existe" }, { status: 400 })
  }

  /**
   * Encripta la contraseña antes de guardarla en la base de datos.
   * 
   * @param password - Contraseña ingresada por el usuario.
   * @returns Una cadena encriptada utilizando bcryptjs.
   */
  const hashedPassword = await hash(password, 10)

  /**
   * Crea un nuevo usuario en la base de datos.
   * 
   * @returns Un objeto con los datos del usuario recién creado.
   */
  const newUser = await prisma.usuario.create({
    data: {
      nombre,
      email,
      password: hashedPassword,
      telefono,
      latitud,
      longitud,
      direccion,
    },
  })

  /**
   * Devuelve una respuesta HTTP con los datos del usuario creado.
   * 
   * @returns Una respuesta JSON con el objeto del usuario.
   */
  return NextResponse.json(newUser)
}