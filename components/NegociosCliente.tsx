'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import NegocioPublicoCard from "@/components/NegocioPublicoCard";

export default function NegociosCliente({ negocios, filtroInicial }: { negocios: any[], filtroInicial: string }) {
  const [buscar, setBuscar] = useState(filtroInicial || "");
  const [mostrarCercanos, setMostrarCercanos] = useState(false);
  const [negociosCercanos, setNegociosCercanos] = useState<any[]>([]);
  const [loadingCercanos, setLoadingCercanos] = useState(false);

  useEffect(() => {
    const fetchCercanos = async () => {
      if (!mostrarCercanos) return;
      setLoadingCercanos(true);
      try {
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

  const negociosFiltrados = (mostrarCercanos ? negociosCercanos : negocios).filter((n) =>
    n.nombre.toLowerCase().includes(buscar.toLowerCase())
  );

   return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-6 text-white">Reservar un Servicio</h1>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/reservas/mis-reservas"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Ver Mis Reservas
        </Link>

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

      <form onSubmit={(e) => e.preventDefault()} className="mb-6">
        <input
          type="text"
          placeholder="Buscar negocios por nombre..."
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded text-black bg-white"
        />
      </form>

      {mostrarCercanos && loadingCercanos ? (
        <p>Cargando negocios cercanos...</p>
      ) : negociosFiltrados.length === 0 ? (
        <p className="text-red-600">
          {mostrarCercanos
            ? "No se encontraron negocios cercanos dentro de tu zona."
            : `No hay negocios disponibles${buscar ? ` para "${buscar}"` : ""}.`}
        </p>
      ) : (
        <ul className="space-y-4">
          {negociosFiltrados.map((negocio) => (
            <li key={negocio.id} className="bg-white p-4 rounded shadow text-black">
              <NegocioPublicoCard negocio={negocio} />
              {mostrarCercanos && negocio.distancia !== undefined && (
                <p className="text-sm text-gray-500 mt-2">
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