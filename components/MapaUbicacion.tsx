'use client';

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useCallback, useState } from "react";

/**
 * Estilo del contenedor del mapa.
 * 
 * Define el tamaño del mapa en la interfaz de usuario.
 */
const containerStyle = {
  width: '100%',
  height: '400px',
};

/**
 * Coordenadas iniciales del centro del mapa.
 * 
 * @value { lat: 40.4168, lng: -3.7038 } - Ubicación de Madrid como ejemplo.
 */
const center = { lat: 40.4168, lng: -3.7038 };

/**
 * Componente MapaUbicacion
 * 
 * Este componente muestra un mapa interactivo utilizando la API de Google Maps.
 * Permite seleccionar una ubicación en el mapa y obtener su dirección.
 */
export default function MapaUbicacion({
  onUbicacionSeleccionada,
  valorInicial,
}: {
  onUbicacionSeleccionada: (lat: number, lng: number, direccion: string) => void;
  valorInicial?: { lat: number, lng: number };
}) {
  /**
   * Carga el script de Google Maps.
   * 
   * @returns {boolean} isLoaded - Indica si el script de Google Maps se ha cargado correctamente.
   */
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  /**
   * Estado local para almacenar la posición seleccionada en el mapa.
   * 
   * @default center - Coordenadas iniciales del mapa.
   */
  const [posicion, setPosicion] = useState(valorInicial || center);

  /**
   * Estado local para almacenar la dirección obtenida de la API de Google Maps.
   * 
   * @default "" - Dirección inicial vacía.
   */
  const [direccion, setDireccion] = useState("");

  /**
   * Maneja el evento de clic en el mapa.
   * 
   * Obtiene las coordenadas de la ubicación seleccionada y realiza una solicitud
   * a la API de Google Maps para obtener la dirección correspondiente.
   * 
   * @param e - Evento de clic en el mapa.
   */
  const handleClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat(); // Latitud de la ubicación seleccionada
    const lng = e.latLng.lng(); // Longitud de la ubicación seleccionada

    setPosicion({ lat, lng }); // Actualiza la posición en el estado local

    /**
     * Realiza una solicitud a la API de Google Maps para obtener la dirección.
     */
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    const dir = data.results?.[0]?.formatted_address || "Dirección no encontrada";

    setDireccion(dir); // Actualiza la dirección en el estado local

    /**
     * Llama a la función proporcionada para enviar la ubicación seleccionada.
     * 
     * @param lat - Latitud de la ubicación seleccionada.
     * @param lng - Longitud de la ubicación seleccionada.
     * @param dir - Dirección obtenida de la API de Google Maps.
     */
    onUbicacionSeleccionada(lat, lng, dir);
  }, [onUbicacionSeleccionada]);

  /**
   * Renderiza un mensaje de carga mientras se carga el script de Google Maps.
   */
  if (!isLoaded) return <p>Cargando mapa...</p>;

  /**
   * Renderiza el mapa interactivo con un marcador en la posición seleccionada.
   */
  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle} // Estilo del contenedor del mapa
        center={posicion} // Centro del mapa
        zoom={13} // Nivel de zoom inicial
        onClick={handleClick} // Maneja el evento de clic en el mapa
      >
        <Marker position={posicion} /> {/* Muestra un marcador en la posición seleccionada */}
      </GoogleMap>

      {/* Muestra la dirección seleccionada debajo del mapa */}
      {direccion && (
        <p className="mt-4 text-sm text-gray-700">
          Dirección seleccionada: <strong>{direccion}</strong>
        </p>
      )}
    </>
  );
}