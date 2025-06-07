"use client";

import { useState } from "react";
import { showSuccess, showError } from "@/lib/toast";

type Props = {
  reservaId: string; // ID único de la reserva que se desea cancelar
};

/**
 * Componente CancelarReservaButton
 * 
 * Este componente muestra un botón que permite al usuario cancelar una reserva.
 * Realiza una solicitud al servidor para actualizar el estado de la reserva a "cancelada".
 */
export default function CancelarReservaButton({ reservaId }: Props) {
  /**
   * Estado local para gestionar el estado de carga mientras se realiza la solicitud.
   * 
   * @value false - Indica que no se está realizando ninguna solicitud.
   * @value true - Indica que la solicitud está en progreso.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Función para cancelar la reserva.
   * 
   * Realiza una solicitud PATCH al servidor para actualizar el estado de la reserva.
   * Muestra un mensaje de confirmación antes de proceder.
   */
  const cancelarReserva = async () => {
    const confirmar = confirm("¿Seguro que deseas cancelar esta reserva?");
    if (!confirmar) return; // Si el usuario cancela, no se realiza ninguna acción

    setLoading(true); // Activa el estado de carga

    try {
      /**
       * Realiza la solicitud al servidor para cancelar la reserva.
       * 
       * @method PATCH - Actualiza el estado de la reserva en el servidor.
       * @headers Content-Type - Indica que el cuerpo de la solicitud está en formato JSON.
       * @body nuevoEstado - Define el nuevo estado de la reserva como "cancelada".
       */
      const res = await fetch(`/api/reservas/${reservaId}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nuevoEstado: "cancelada" }),
      });

      if (res.ok) {
        /**
         * Muestra un mensaje de éxito si la reserva se cancela correctamente.
         * Recarga la página para reflejar los cambios.
         */
        showSuccess("Reserva cancelada correctamente");
        window.location.reload();
      } else {
        /**
         * Muestra un mensaje de error si la solicitud falla.
         */
        showError("No se pudo cancelar la reserva");
      }
    } catch (error) {
      /**
       * Manejo de errores inesperados.
       * Muestra un mensaje de error si ocurre un problema durante la solicitud.
       */
      showError("Ocurrió un error al cancelar la reserva");
    } finally {
      setLoading(false); // Desactiva el estado de carga
    }
  };

  /**
   * Renderiza el botón para cancelar la reserva.
   * 
   * @disabled - Desactiva el botón mientras la solicitud está en progreso.
   * @className - Define estilos para el botón, incluyendo colores y estados de hover.
   */
  return (
    <button
      onClick={cancelarReserva}
      disabled={loading}
      className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Cancelando..." : "Cancelar"} {/* Muestra un texto dinámico según el estado de carga */}
    </button>
  );
}
