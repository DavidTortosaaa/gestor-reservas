'use client';

import { OpcionesReservaButtons } from "@/components/OpcionesReservaButtons";

type Props = {
  reserva: {
    id: string; // ID único de la reserva
    fechaHora: Date; // Fecha y hora de la reserva
    estado: string; // Estado actual de la reserva (ej. "pendiente", "confirmada", "cancelada")
    cliente: {
      nombre: string | null; // Nombre del cliente asociado a la reserva
    } | null;
    servicioNombre: string; // Nombre del servicio reservado
  };
};

/**
 * Componente ReservaAdminCard
 * 
 * Este componente muestra una tarjeta con información detallada de una reserva.
 * Incluye datos como el servicio reservado, el cliente, la hora y el estado de la reserva.
 * Si la reserva está pendiente, muestra botones para confirmar o cancelar la reserva.
 */
export default function ReservaAdminCard({ reserva }: Props) {
  /**
   * Renderiza la tarjeta de la reserva.
   * 
   * Incluye información básica de la reserva y opciones para cambiar su estado si está pendiente.
   */
  return (
    <li className="bg-white p-4 rounded shadow text-black">
      {/* Información del servicio reservado */}
      <p>
        <strong>Servicio:</strong> {reserva.servicioNombre}
      </p>

      {/* Información del cliente */}
      <p>
        <strong>Cliente:</strong> {reserva.cliente?.nombre || "Desconocido"}
      </p>

      {/* Hora de la reserva */}
      <p>
        <strong>Hora:</strong>{" "}
        {new Date(reserva.fechaHora).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      {/* Estado de la reserva */}
      <p>
        <strong>Estado:</strong> {reserva.estado}
      </p>

      {/* Botones para confirmar o cancelar la reserva si está pendiente */}
      {reserva.estado === "pendiente" && (
        <OpcionesReservaButtons reservaId={reserva.id} />
      )}
    </li>
  );
}
