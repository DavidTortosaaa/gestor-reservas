import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth-options"
import { prisma } from "@/lib/prisma"

// Endpoint para crear un nuevo negocio
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 })
  }

  const data = await req.json()

  const propietario = await prisma.usuario.findUnique({
    where: { email: session.user.email }
  })

  if (!propietario) {
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
  }

  try {
    const nuevoNegocio = await prisma.negocio.create({
      data: {
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        horario_apertura: data.horario_apertura,
        horario_cierre: data.horario_cierre,
        propietarioId: propietario.id
      }
    })

    return NextResponse.json(nuevoNegocio)
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}