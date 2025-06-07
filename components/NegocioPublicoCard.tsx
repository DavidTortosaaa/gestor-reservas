'use client'

import Link from "next/link"

interface NegocioPublicoCardProps {
  negocio: {
    id: string
    nombre: string
    direccion: string | null
    horario_apertura: string
    horario_cierre: string
  }
}

export default function NegocioPublicoCard({ negocio }: NegocioPublicoCardProps) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow text-black">
      <h2 className="text-xl font-bold mb-2">{negocio.nombre}</h2>
      <p className="text-sm text-gray-700 mb-1">
        {negocio.direccion || "Dirección no especificada"}
      </p>
      <p className="text-sm text-gray-700 mb-4">
        Horario: {negocio.horario_apertura} - {negocio.horario_cierre}
      </p>

      <Link
        href={`/reservas/${negocio.id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Ver servicios
      </Link>
    </div>
  )
}
