'use client'

import Link from "next/link"

interface ServicioPublicoCardProps {
  servicio: {
    id: string
    nombre: string
    descripcion: string | null
    duracion: number
    precio: number
  }
  negocio: {
    id: string
    nombre: string
  }
}

export default function ServicioPublicoCard({ servicio, negocio }: ServicioPublicoCardProps) {
  return (
    <li className="p-4 border rounded bg-white shadow text-black">
      <h2 className="text-lg font-semibold">{servicio.nombre}</h2>
      {servicio.descripcion && <p className="text-sm text-gray-600">{servicio.descripcion}</p>}
      <p className="mt-2">Duración: {servicio.duracion} minutos</p>
      <p>Precio: {servicio.precio.toFixed(2)} €</p>

      <Link
        href={`/reservas/${negocio.id}/${servicio.id}`}
        className="mt-4 inline-block bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
      >
        Reservar
      </Link>
    </li>
  )
}//estilo