import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Endpoint para el registro
export async function POST(req: Request) {
  const { nombre, email, password, telefono, latitud, longitud, direccion } = await req.json()

  const userExists = await prisma.usuario.findUnique({
    where: { email },
  })

  if (userExists) {
    return NextResponse.json({ message: "El usuario ya existe" }, { status: 400 })
  }

  const hashedPassword = await hash(password, 10)

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

  return NextResponse.json(newUser)
}