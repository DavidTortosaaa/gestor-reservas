'use client'

import Link from "next/link"

interface NegocioCardProps {
  negocio: {
    id: string
    nombre: string
    email: string
    telefono: string | null
    direccion: string | null
    horario_apertura: string
    horario_cierre: string
  }
}

export default function NegocioCard({ negocio }: NegocioCardProps) {
  const handleDelete = async () => {
    const confirmed = confirm("¿Estás seguro de que quieres eliminar este negocio?")
    if (!confirmed) return

    const res = await fetch(`/api/negocios/${negocio.id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      window.location.reload()
    }
  }

  return (
    <li className="p-4 border rounded bg-white text-black">
      <h2 className="text-lg font-semibold">{negocio.nombre}</h2>
      <p>{negocio.email}</p>
      <p>{negocio.telefono}</p>
      <p>{negocio.direccion}</p>
      <p>Horario: {negocio.horario_apertura} - {negocio.horario_cierre}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/negocios/${negocio.id}/editar`}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Editar
        </Link>

        <Link
          href={`/negocios/${negocio.id}/servicios`}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Ver Servicios
        </Link>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}