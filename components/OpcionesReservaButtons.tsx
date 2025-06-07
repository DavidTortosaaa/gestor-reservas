'use client';

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { showSuccess, showError } from "@/lib/toast";
import PrimaryButton from "@/components/ui/PrimaryButton";

type EstadoButtonProps = {
  reservaId: string; // ID único de la reserva que se desea modificar
};

/**
 * Componente OpcionesReservaButtons
 * 
 * Este componente muestra botones para confirmar o cancelar una reserva.
 * Realiza solicitudes al servidor para cambiar el estado de la reserva y actualiza la interfaz.
 */
export function OpcionesReservaButtons({ reservaId }: EstadoButtonProps) {
  /**
   * Estado de transición para manejar solicitudes asíncronas.
   * 
   * @property isPending - Indica si hay una solicitud en progreso.
   * @property startTransition - Inicia una transición asíncrona.
   */
  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Hook para manejar la navegación y refrescar la página

  /**
   * Cambia el estado de la reserva.
   * 
   * Realiza una solicitud POST al servidor para confirmar o cancelar la reserva.
   * Muestra mensajes de éxito o error según el resultado de la solicitud.
   * 
   * @param accion - Acción a realizar: "confirmar" o "cancelar".
   */
  const cambiarEstado = (accion: "confirmar" | "cancelar") => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("accion", accion);

      try {
        /**
         * Realiza la solicitud al servidor para cambiar el estado de la reserva.
         * 
         * @method POST - Cambia el estado de la reserva en el servidor.
         * @body formData - Contiene la acción a realizar.
         */
        const res = await fetch(`/api/reservas/${reservaId}/estado`, {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          /**
           * Muestra un mensaje de éxito si el estado de la reserva se cambia correctamente.
           * Refresca la página para reflejar los cambios.
           */
          showSuccess(`Reserva ${accion === "confirmar" ? "confirmada" : "cancelada"} correctamente.`);
          router.refresh();
        } else {
          /**
           * Muestra un mensaje de error si la solicitud falla.
           */
          const err = await res.json();
          showError(err.message || "Error al cambiar el estado.");
        }
      } catch (error) {
        /**
         * Manejo de errores inesperados.
         * Muestra un mensaje de error si ocurre un problema durante la solicitud.
         */
        showError("Ocurrió un error al cambiar el estado de la reserva.");
      }
    });
  };

  /**
   * Renderiza los botones para confirmar o cancelar la reserva.
   * 
   * @disabled - Desactiva los botones mientras la solicitud está en progreso.
   * @className - Define estilos para los botones, incluyendo colores y estados de hover.
   */
  return (
    <div className="mt-2 flex gap-2">
      {/* Botón para confirmar la reserva */}
      <PrimaryButton
        onClick={() => cambiarEstado("confirmar")}
        disabled={isPending}
        className="!w-auto bg-green-600 hover:bg-green-700"
      >
        Confirmar
      </PrimaryButton>

      {/* Botón para cancelar la reserva */}
      <PrimaryButton
        onClick={() => cambiarEstado("cancelar")}
        disabled={isPending}
        className="!w-auto bg-red-600 hover:bg-red-700"
      >
        Cancelar
      </PrimaryButton>
    </div>
  );
}
