import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

// GET: Obtener perfil
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 })
  }

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
  })

  if (!usuario) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
  }

  return NextResponse.json(usuario)
}

// PATCH: Actualizar nombre, teléfono, ubicación y contraseña
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 })
  }

  const { nombre, telefono, password, latitud, longitud, direccion } = await req.json()

  if (!nombre || nombre.trim() === "") {
    return NextResponse.json({ message: "Nombre no válido" }, { status: 400 })
  }

  const dataToUpdate: {
    nombre: string;
    telefono?: string;
    password?: string;
    latitud?: number;
    longitud?: number;
    direccion?: string;
  } = { nombre }

  if (telefono !== undefined) dataToUpdate.telefono = telefono
  if (latitud !== undefined) dataToUpdate.latitud = latitud
  if (longitud !== undefined) dataToUpdate.longitud = longitud
  if (direccion !== undefined) dataToUpdate.direccion = direccion

  if (password && password.trim() !== "") {
    if (password.length < 6) {
      return NextResponse.json({ message: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }
    const hashed = await hash(password, 10)
    dataToUpdate.password = hashed
  }

  const actualizado = await prisma.usuario.update({
    where: { email: session.user.email },
    data: dataToUpdate,
  })

  return NextResponse.json({ message: "Perfil actualizado", usuario: actualizado })
}