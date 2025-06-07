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
    <li className="p-4 border rounded-lg bg-white shadow text-black space-y-2">
      <h2 className="text-xl font-semibold">{servicio.nombre}</h2>

      {servicio.descripcion && (
        <p className="text-sm text-gray-700">{servicio.descripcion}</p>
      )}

      <div className="text-sm text-gray-800">
        <p>🕒 Duración: {servicio.duracion} minutos</p>
        <p>💶 Precio: {servicio.precio.toFixed(2)} €</p>
      </div>

      <Link
        href={`/reservas/${negocio.id}/${servicio.id}`}
        className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Reservar
      </Link>
    </li>
  )
}
