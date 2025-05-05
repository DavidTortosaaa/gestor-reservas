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
    <li className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-semibold">{negocio.nombre}</h2>
      <p>{negocio.direccion}</p>
      <p>Horario: {negocio.horario_apertura} - {negocio.horario_cierre}</p>

      <div className="mt-3">
        <Link
          href={`/reservas/${negocio.id}`}
          className="inline-block bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ver servicios
        </Link>
      </div>
    </li>
  )
}//estilo