'use client'

import { useState } from "react"
import Link from "next/link"
import { showSuccess, showError } from "@/lib/toast"

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
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmed = confirm("¿Estás seguro de que quieres eliminar este negocio?")
    if (!confirmed) return

    setLoading(true)

    const res = await fetch(`/api/negocios/${negocio.id}`, { method: "DELETE" })

    if (res.ok) {
      showSuccess("Negocio eliminado correctamente")
      setTimeout(() => window.location.reload(), 1500)
    } else {
      const error = await res.json()
      showError(error.message || "Error al eliminar el negocio")
      setLoading(false)
    }
  }

  return (
    <li className="p-4 border rounded bg-white text-black shadow-sm hover:shadow-md transition">
      <h2 className="text-xl font-semibold mb-1">{negocio.nombre}</h2>
      <p className="text-sm text-gray-700">{negocio.email}</p>
      <p className="text-sm text-gray-700">{negocio.telefono}</p>
      <p className="text-sm text-gray-700">{negocio.direccion}</p>
      <p className="text-sm text-gray-700">
        Horario: {negocio.horario_apertura} - {negocio.horario_cierre}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={`/negocios/${negocio.id}/editar`}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
        >
          Editar
        </Link>

        <Link
          href={`/negocios/${negocio.id}/servicios`}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Ver Servicios
        </Link>

        <Link
          href={`/negocios/${negocio.id}/reservas`}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
        >
          Mostrar Reservas
        </Link>

        <button
          onClick={handleDelete}
          disabled={loading}
          className={`bg-red-600 text-white px-3 py-1 rounded transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
          }`}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </li>
  )
}
