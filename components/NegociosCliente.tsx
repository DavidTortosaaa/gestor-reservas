'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import NegocioPublicoCard from "@/components/NegocioPublicoCard";

/**
 * Componente NegociosCliente
 * 
 * Este componente muestra una lista de negocios disponibles para reservar servicios.
 * Permite filtrar negocios por nombre y mostrar solo negocios cercanos a la ubicación del usuario.
 */
export default function NegociosCliente({
  negocios,
  filtroInicial,
}: {
  negocios: any[];
  filtroInicial: string;
}) {
  /**
   * Estado local para almacenar el texto de búsqueda.
   * 
   * @default filtroInicial - Texto inicial para filtrar negocios.
   */
  const [buscar, setBuscar] = useState(filtroInicial || "");

  /**
   * Estado local para controlar si se muestran solo negocios cercanos.
   * 
   * @default false - Indica que se muestran todos los negocios.
   */
  const [mostrarCercanos, setMostrarCercanos] = useState(false);

  /**
   * Estado local para almacenar los negocios cercanos obtenidos del servidor.
   * 
   * @default [] - Lista vacía de negocios cercanos.
   */
  const [negociosCercanos, setNegociosCercanos] = useState<any[]>([]);

  /**
   * Estado local para gestionar el estado de carga mientras se obtienen negocios cercanos.
   * 
   * @default false - Indica que no se está realizando ninguna solicitud.
   */
  const [loadingCercanos, setLoadingCercanos] = useState(false);

  /**
   * Efecto para cargar negocios cercanos cuando se activa el filtro.
   * 
   * Realiza una solicitud al servidor para obtener negocios cercanos.
   */
  useEffect(() => {
    const fetchCercanos = async () => {
      if (!mostrarCercanos) return;
      setLoadingCercanos(true);
      try {
        /**
         * Solicitud al servidor para obtener negocios cercanos.
         * 
         * @endpoint /api/negocios/cercanos - Devuelve una lista de negocios cercanos.
         */
        const res = await fetch("/api/negocios/cercanos");
        const data = await res.json();
        setNegociosCercanos(data);
      } catch (error) {
        console.error("Error al cargar negocios cercanos");
      }
      setLoadingCercanos(false);
    };

    fetchCercanos();
  }, [mostrarCercanos]);

  /**
   * Filtra los negocios según el texto de búsqueda y el estado del filtro de cercanía.
   * 
   * @returns Una lista de negocios que coinciden con el filtro.
   */
  const negociosFiltrados = (mostrarCercanos ? negociosCercanos : negocios).filter((n) =>
    n.nombre.toLowerCase().includes(buscar.toLowerCase())
  );

  /**
   * Renderiza la interfaz de usuario para mostrar negocios disponibles.
   * 
   * Incluye un filtro de búsqueda, un interruptor para mostrar negocios cercanos,
   * y una lista de negocios filtrados.
   */
  return (
    <div className="max-w-5xl mx-auto px-4 text-black">
      {/* Título de la página */}
      <h1 className="text-3xl font-bold mb-6 text-white">Reservar un Servicio</h1>

      {/* Filtros y opciones */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        {/* Enlace para ver las reservas del usuario */}
        <Link
          href="/reservas/mis-reservas"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Ver Mis Reservas
        </Link>

        {/* Interruptor para mostrar negocios cercanos */}
        <div className="flex items-center gap-3">
          <label htmlFor="switch" className="text-black bg-white px-2 rounded cursor-pointer">
            Mostrar solo negocios cercanos
          </label>
          <div className="relative">
            <input
              type="checkbox"
              id="switch"
              checked={mostrarCercanos}
              onChange={(e) => setMostrarCercanos(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-colors"></div>
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
          </div>
        </div>
      </div>

      {/* Campo de búsqueda */}
      <form onSubmit={(e) => e.preventDefault()} className="mb-6">
        <input
          type="text"
          placeholder="Buscar negocios por nombre..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded text-black bg-white"
        />
      </form>

      {/* Mensajes de estado y lista de negocios */}
      {mostrarCercanos && loadingCercanos ? (
        <p className="text-white">Cargando negocios cercanos...</p>
      ) : negociosFiltrados.length === 0 ? (
        <p className="text-red-600">
          {mostrarCercanos
            ? "No se encontraron negocios cercanos dentro de tu zona."
            : `No hay negocios disponibles${buscar ? ` para "${buscar}"` : ""}.`}
        </p>
      ) : (
        <ul className="space-y-4">
          {negociosFiltrados.map((negocio) => (
            <li key={negocio.id}>
              <NegocioPublicoCard negocio={negocio} />
              {mostrarCercanos && negocio.distancia !== undefined && (
                <p className="text-sm text-white mt-1 pl-1">
                  A aproximadamente {negocio.distancia.toFixed(1)} km de tu ubicación.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
