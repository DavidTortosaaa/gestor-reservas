'use client';

import CancelarReservaButton from "@/components/CancelarReservaButton";

type Props = {
  reserva: {
    id: string;
    fechaHora: Date;
    estado: string;
    servicio: {
      nombre: string;
      negocio: { nombre: string };
    };
  };
  esPasada?: boolean;
};

export default function ReservaCard({ reserva, esPasada = false }: Props) {
  const fecha = new Date(reserva.fechaHora);

  return (
    <li className={`${esPasada ? "bg-gray-100" : "bg-white"} p-4 rounded shadow text-black`}>
      <p><strong>Negocio:</strong> {reserva.servicio.negocio.nombre}</p>
      <p><strong>Servicio:</strong> {reserva.servicio.nombre}</p>
      <p><strong>Fecha:</strong> {fecha.toLocaleDateString()}</p>
      <p><strong>Hora:</strong> {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
      <p><strong>Estado:</strong> {reserva.estado}</p>

      {!esPasada && ["pendiente", "confirmada"].includes(reserva.estado) && (
        <CancelarReservaButton reservaId={reserva.id} />
      )}
    </li>
  );
}
