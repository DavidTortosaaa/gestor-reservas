'use client';

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";

interface ServicioCardProps {
  servicio: {
    id: string; // ID único del servicio
    nombre: string; // Nombre del servicio
    descripcion?: string | null; // Descripción del servicio (opcional)
    duracion: number; // Duración del servicio en minutos
    precio: number; // Precio del servicio en euros
    negocioId: string; // ID del negocio asociado al servicio
  };
}

/**
 * Componente ServicioCard
 * 
 * Este componente muestra una tarjeta con información detallada de un servicio.
 * Incluye datos como nombre, descripción, duración y precio del servicio.
 * También permite editar o eliminar el servicio mediante botones de acción.
 */
export default function ServicioCard({ servicio }: ServicioCardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Estado de carga mientras se elimina el servicio

  /**
   * Maneja la eliminación del servicio.
   * 
   * Realiza una solicitud DELETE al servidor para eliminar el servicio.
   * Muestra mensajes de éxito o error según el resultado de la solicitud.
   */
  const handleDelete = async () => {
    const confirmed = confirm("¿Estás seguro de que quieres eliminar este servicio?");
    if (!confirmed) return; // Si el usuario cancela, no se realiza ninguna acción

    setLoading(true); // Activa el estado de carga

    try {
      /**
       * Realiza la solicitud al servidor para eliminar el servicio.
       * 
       * @method DELETE - Elimina el servicio en el servidor.
       */
      const res = await fetch(`/api/servicios/${servicio.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        /**
         * Muestra un mensaje de éxito si el servicio se elimina correctamente.
         * Refresca la página para reflejar los cambios.
         */
        showSuccess("Servicio eliminado correctamente");
        router.refresh();
      } else {
        /**
         * Muestra un mensaje de error si la solicitud falla.
         */
        showError("Hubo un error al eliminar el servicio");
      }
    } catch (error) {
      /**
       * Manejo de errores inesperados.
       * Muestra un mensaje de error si ocurre un problema durante la solicitud.
       */
      showError("Ocurrió un error al eliminar el servicio");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  /**
   * Renderiza la tarjeta del servicio.
   * 
   * Incluye información básica del servicio y botones para editar o eliminar.
   */
  return (
    <li className="p-4 border rounded-lg bg-white shadow-sm text-black space-y-2">
      {/* Nombre del servicio */}
      <h2 className="text-lg font-semibold">{servicio.nombre}</h2>

      {/* Descripción del servicio (opcional) */}
      {servicio.descripcion && <p className="text-sm text-gray-700">{servicio.descripcion}</p>}

      {/* Duración del servicio */}
      <p className="text-sm">🕒 {servicio.duracion} min</p>

      {/* Precio del servicio */}
      <p className="text-sm">💶 {servicio.precio.toFixed(2)} €</p>

      {/* Botones de acción */}
      <div className="mt-3 flex flex-wrap gap-2">
        {/* Botón para editar el servicio */}
        <Link
          href={`/negocios/${servicio.negocioId}/servicios/${servicio.id}/editar`}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
        >
          Editar
        </Link>

        {/* Botón para eliminar el servicio */}
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
  );
}
