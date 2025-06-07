'use client';

import Link from "next/link";

interface ServicioPublicoCardProps {
  servicio: {
    id: string; // ID único del servicio
    nombre: string; // Nombre del servicio
    descripcion: string | null; // Descripción del servicio (opcional)
    duracion: number; // Duración del servicio en minutos
    precio: number; // Precio del servicio en euros
  };
  negocio: {
    id: string; // ID único del negocio asociado al servicio
    nombre: string; // Nombre del negocio
  };
}

/**
 * Componente ServicioPublicoCard
 * 
 * Este componente muestra una tarjeta pública con información de un servicio.
 * Incluye detalles como nombre, descripción, duración y precio del servicio.
 * También permite reservar el servicio mediante un enlace.
 */
export default function ServicioPublicoCard({ servicio, negocio }: ServicioPublicoCardProps) {
  /**
   * Renderiza la tarjeta del servicio público.
   * 
   * Incluye información básica del servicio y un botón para reservar.
   */
  return (
    <li className="p-4 border rounded-lg bg-white shadow text-black space-y-2">
      {/* Nombre del servicio */}
      <h2 className="text-xl font-semibold">{servicio.nombre}</h2>

      {/* Descripción del servicio (opcional) */}
      {servicio.descripcion && (
        <p className="text-sm text-gray-700">{servicio.descripcion}</p>
      )}

      {/* Detalles del servicio */}
      <div className="text-sm text-gray-800">
        <p>🕒 Duración: {servicio.duracion} minutos</p>
        <p>💶 Precio: {servicio.precio.toFixed(2)} €</p>
      </div>

      {/* Enlace para reservar el servicio */}
      <Link
        href={`/reservas/${negocio.id}/${servicio.id}`}
        className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Reservar
      </Link>
    </li>
  );
}
