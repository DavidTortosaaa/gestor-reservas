'use client';

import { OpcionesReservaButtons } from "@/components/OpcionesReservaButtons";

type Props = {
  reserva: {
    id: string;
    fechaHora: Date;
    estado: string;
    cliente: {
      nombre: string | null;
    } | null;
    servicioNombre: string;
  };
};

export default function ReservaAdminCard({ reserva }: Props) {
  return (
    <li className="bg-white p-4 rounded shadow text-black">
      <p>
        <strong>Servicio:</strong> {reserva.servicioNombre}
      </p>
      <p>
        <strong>Cliente:</strong> {reserva.cliente?.nombre || "Desconocido"}
      </p>
      <p>
        <strong>Hora:</strong>{" "}
        {new Date(reserva.fechaHora).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      <p>
        <strong>Estado:</strong> {reserva.estado}
      </p>

      {reserva.estado === "pendiente" && (
        <OpcionesReservaButtons reservaId={reserva.id} />
      )}
    </li>
  );
}
