'use client';

import CancelarReservaButton from "@/components/CancelarReservaButton";

type Props = {
  reserva: {
    id: string; // ID único de la reserva
    fechaHora: Date; // Fecha y hora de la reserva
    estado: string; // Estado actual de la reserva (ej. "pendiente", "confirmada", "cancelada")
    servicio: {
      nombre: string; // Nombre del servicio reservado
      negocio: { nombre: string }; // Nombre del negocio asociado al servicio
    };
  };
  esPasada?: boolean; // Indica si la reserva ya ha pasado
};

/**
 * Componente ReservaCard
 * 
 * Este componente muestra una tarjeta con información detallada de una reserva.
 * Incluye datos como el negocio, servicio, fecha, hora y estado de la reserva.
 * Si la reserva está activa, permite cancelarla mediante un botón.
 */
export default function ReservaCard({ reserva, esPasada = false }: Props) {
  /**
   * Convierte la fecha y hora de la reserva en un objeto Date para formatearla.
   */
  const fecha = new Date(reserva.fechaHora);

  /**
   * Renderiza la tarjeta de la reserva.
   * 
   * Incluye información básica de la reserva y un botón para cancelarla si está activa.
   */
  return (
    <li className={`${esPasada ? "bg-gray-100" : "bg-white"} p-4 rounded shadow text-black`}>
      {/* Información del negocio */}
      <p>
        <strong>{reserva.servicio.negocio.nombre}</strong> 
      </p>

      {/* Información del servicio */}
      <p>
        <strong>Servicio:</strong> {reserva.servicio.nombre}
      </p>

      {/* Fecha de la reserva */}
      <p>
        <strong>Fecha:</strong> {fecha.toLocaleDateString()}
      </p>

      {/* Hora de la reserva */}
      <p>
        <strong>Hora:</strong>{" "}
        {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>

      {/* Estado de la reserva */}
      <p>
        <strong>Estado:</strong> {reserva.estado}
      </p>

      {/* Botón para cancelar la reserva si está activa */}
      {!esPasada && ["pendiente", "confirmada"].includes(reserva.estado) && (
        <CancelarReservaButton reservaId={reserva.id} />
      )}
    </li>
  );
}
