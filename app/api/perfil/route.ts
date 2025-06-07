import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

/**
 * Endpoint para obtener el perfil del usuario autenticado.
 * 
 * Este endpoint devuelve la información del perfil del usuario autenticado.
 */
export async function GET() {
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
   * Busca al usuario en la base de datos utilizando el email de la sesión.
   * 
   * @returns Un objeto con la información del usuario o una respuesta de error si no se encuentra.
   */
  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user.email },
    select: {
      nombre: true,
      email: true,
      telefono: true,
      latitud: true,
      longitud: true,
      direccion: true,
    },
  });

  if (!usuario) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });
  }

  /**
   * Devuelve una respuesta HTTP con la información del perfil del usuario.
   * 
   * @returns Una respuesta JSON con el objeto del usuario.
   */
  return NextResponse.json(usuario);
}

/**
 * Endpoint para actualizar el perfil del usuario autenticado.
 * 
 * Este endpoint permite actualizar el nombre, teléfono, ubicación y contraseña del usuario.
 */
export async function PATCH(req: Request) {
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
   * @param req - Solicitud HTTP con los datos del perfil.
   * @returns Un objeto con los datos actualizados del perfil.
   */
  const { nombre, telefono, password, latitud, longitud, direccion } = await req.json();

  /**
   * Valida el nombre del usuario.
   * 
   * @returns Una respuesta de error si el nombre no es válido.
   */
  if (!nombre || nombre.trim() === "") {
    return NextResponse.json({ message: "Nombre no válido" }, { status: 400 });
  }

  /**
   * Construye el objeto con los datos a actualizar.
   */
  const dataToUpdate: {
    nombre: string;
    telefono?: string;
    password?: string;
    latitud?: number;
    longitud?: number;
    direccion?: string;
  } = { nombre };

  if (telefono !== undefined) dataToUpdate.telefono = telefono;
  if (latitud !== undefined) dataToUpdate.latitud = latitud;
  if (longitud !== undefined) dataToUpdate.longitud = longitud;
  if (direccion !== undefined) dataToUpdate.direccion = direccion;

  /**
   * Valida y encripta la contraseña si se proporciona.
   * 
   * @returns Una respuesta de error si la contraseña no cumple con los requisitos.
   */
  if (password && password.trim() !== "") {
    if (password.length < 6) {
      return NextResponse.json({ message: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
    }
    const hashed = await hash(password, 10);
    dataToUpdate.password = hashed;
  }

  /**
   * Actualiza la información del usuario en la base de datos.
   * 
   * @returns El objeto del usuario actualizado.
   */
  const actualizado = await prisma.usuario.update({
    where: { email: session.user.email },
    data: dataToUpdate,
  });

  /**
   * Devuelve una respuesta HTTP con los datos del perfil actualizado.
   * 
   * @returns Una respuesta JSON con el objeto del usuario actualizado.
   */
  return NextResponse.json({ message: "Perfil actualizado", usuario: actualizado });
}