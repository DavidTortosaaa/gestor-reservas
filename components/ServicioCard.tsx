'use client'

import Link from "next/link"
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
  const handleDelete = async () => {
    const confirmed = confirm("¿Estás seguro de que quieres eliminar este servicio?");
    if (!confirmed) return;

    const res = await fetch(`/api/servicios/${servicio.id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      showSuccess("Servicio eliminado correctamente");
      window.location.reload();
    } else {
      showError("Hubo un error al eliminar el servicio");
    }
  };

  return (
    <li className="p-4 border rounded bg-white shadow text-black">
      <h2 className="text-lg font-semibold">{servicio.nombre}</h2>
      {servicio.descripcion && <p>{servicio.descripcion}</p>}
      <p>Duración: {servicio.duracion} min</p>
      <p>Precio: {servicio.precio.toFixed(2)} €</p>

      <div className="mt-2 flex gap-2">
        <Link
          href={`/negocios/${servicio.negocioId}/servicios/${servicio.id}/editar`}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Editar
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
