'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { showSuccess, showError } from "@/lib/toast"

interface ServicioCardProps {
  servicio: {
    id: string
    nombre: string
    descripcion?: string | null
    duracion: number
    precio: number
    negocioId: string
  }
}

export default function ServicioCard({ servicio }: ServicioCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmed = confirm("¿Estás seguro de que quieres eliminar este servicio?")
    if (!confirmed) return

    setLoading(true)

    const res = await fetch(`/api/servicios/${servicio.id}`, {
      method: "DELETE",
    })

    if (res.ok) {
      showSuccess("Servicio eliminado correctamente")
      router.refresh()
    } else {
      showError("Hubo un error al eliminar el servicio")
      setLoading(false)
    }
  }

  return (
    <li className="p-4 border rounded-lg bg-white shadow-sm text-black space-y-2">
      <h2 className="text-lg font-semibold">{servicio.nombre}</h2>
      {servicio.descripcion && <p className="text-sm text-gray-700">{servicio.descripcion}</p>}
      <p className="text-sm">🕒 {servicio.duracion} min</p>
      <p className="text-sm">💶 {servicio.precio.toFixed(2)} €</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <Link
          href={`/negocios/${servicio.negocioId}/servicios/${servicio.id}/editar`}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
        >
          Editar
        </Link>
        <button
          onClick={handleDelete}
          disabled={loading}
          className={`text-sm px-3 py-1 rounded transition text-white ${
            loading
              ? "bg-red-600 opacity-50 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </li>
  )
}
