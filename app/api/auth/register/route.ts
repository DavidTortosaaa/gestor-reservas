import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//Endpoint para el registro

export async function POST(req: Request) {
  const { nombre, email, password, telefono } = await req.json()

  // Verifica si ya existe un usuario con ese email
  const userExists = await prisma.usuario.findUnique({
    where: { email },
  })

  if (userExists) {
    return NextResponse.json(
      { message: "El usuario ya existe" },
      { status: 400 }
    )
  }

  // Hashea la contraseña
  const hashedPassword = await hash(password, 10)

  // Crea el nuevo usuario
  const newUser = await prisma.usuario.create({
    data: {
      nombre,
      email,
      password: hashedPassword,
      telefono,
    },
  })

  return NextResponse.json(newUser)
}