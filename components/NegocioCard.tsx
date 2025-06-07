'use client';

import { useState } from "react";
import Link from "next/link";
import { showSuccess, showError } from "@/lib/toast";

interface NegocioCardProps {
  negocio: {
    id: string;
    nombre: string;
    email: string;
    telefono: string | null;
    direccion: string | null;
    horario_apertura: string;
    horario_cierre: string;
  };
}

/**
 * Componente NegocioCard
 * 
 * Este componente muestra una tarjeta con información de un negocio.
 * Incluye opciones para editar, ver servicios, mostrar reservas y eliminar el negocio.
 */
export default function NegocioCard({ negocio }: NegocioCardProps) {
  /**
   * Estado local para gestionar el estado de carga mientras se elimina el negocio.
   * 
   * @value false - Indica que no se está realizando ninguna acción.
   * @value true - Indica que la eliminación está en progreso.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Maneja la eliminación del negocio.
   * 
   * Realiza una solicitud DELETE al servidor para eliminar el negocio.
   * Muestra mensajes de confirmación, éxito o error según el resultado de la solicitud.
   */
  const handleDelete = async () => {
    const confirmed = confirm("¿Estás seguro de que quieres eliminar este negocio?");
    if (!confirmed) return; // Si el usuario cancela, no se realiza ninguna acción

    setLoading(true); // Activa el estado de carga

    try {
      /**
       * Realiza la solicitud al servidor para eliminar el negocio.
       * 
       * @method DELETE - Elimina el negocio en el servidor.
       */
      const res = await fetch(`/api/negocios/${negocio.id}`, { method: "DELETE" });

      if (res.ok) {
        /**
         * Muestra un mensaje de éxito si el negocio se elimina correctamente.
         * Recarga la página para reflejar los cambios.
         */
        showSuccess("Negocio eliminado correctamente");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        /**
         * Muestra un mensaje de error si la solicitud falla.
         */
        const error = await res.json();
        showError(error.message || "Error al eliminar el negocio");
      }
    } catch (error) {
      /**
       * Manejo de errores inesperados.
       * Muestra un mensaje de error si ocurre un problema durante la solicitud.
       */
      showError("Ocurrió un error al eliminar el negocio");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  /**
   * Renderiza la tarjeta del negocio.
   * 
   * Incluye información del negocio y botones para realizar acciones.
   */
  return (
    <li className="p-4 border rounded bg-white text-black shadow-sm hover:shadow-md transition">
      {/* Información del negocio */}
      <h2 className="text-xl font-semibold mb-1">{negocio.nombre}</h2>
      <p className="text-sm text-gray-700">{negocio.email}</p>
      <p className="text-sm text-gray-700">{negocio.telefono}</p>
      <p className="text-sm text-gray-700">{negocio.direccion}</p>
      <p className="text-sm text-gray-700">
        Horario: {negocio.horario_apertura} - {negocio.horario_cierre}
      </p>

      {/* Botones de acción */}
      <div className="mt-4 flex flex-wrap gap-2">
        {/* Botón para editar el negocio */}
        <Link
          href={`/negocios/${negocio.id}/editar`}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
        >
          Editar
        </Link>

        {/* Botón para ver servicios del negocio */}
        <Link
          href={`/negocios/${negocio.id}/servicios`}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        >
          Ver Servicios
        </Link>

        {/* Botón para mostrar reservas del negocio */}
        <Link
          href={`/negocios/${negocio.id}/reservas`}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
        >
          Mostrar Reservas
        </Link>

        {/* Botón para eliminar el negocio */}
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
  );
}
