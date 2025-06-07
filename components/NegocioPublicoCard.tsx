'use client';

import Link from "next/link";

interface NegocioPublicoCardProps {
  negocio: {
    id: string;
    nombre: string;
    direccion: string | null;
    horario_apertura: string;
    horario_cierre: string;
  };
}

/**
 * Componente NegocioPublicoCard
 * 
 * Este componente muestra una tarjeta pública con información de un negocio.
 * Incluye detalles como el nombre, dirección y horario del negocio, y un enlace para ver los servicios disponibles.
 */
export default function NegocioPublicoCard({ negocio }: NegocioPublicoCardProps) {
  /**
   * Renderiza la tarjeta del negocio público.
   * 
   * Incluye información básica del negocio y un botón para acceder a los servicios.
   */
  return (
    <div className="p-6 border rounded-lg bg-white shadow text-black">
      {/* Nombre del negocio */}
      <h2 className="text-xl font-bold mb-2">{negocio.nombre}</h2>

      {/* Dirección del negocio */}
      <p className="text-sm text-gray-700 mb-1">
        {negocio.direccion || "Dirección no especificada"}
      </p>

      {/* Horario del negocio */}
      <p className="text-sm text-gray-700 mb-4">
        Horario: {negocio.horario_apertura} - {negocio.horario_cierre}
      </p>

      {/* Enlace para ver los servicios del negocio */}
      <Link
        href={`/reservas/${negocio.id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Ver servicios
      </Link>
    </div>
  );
}
