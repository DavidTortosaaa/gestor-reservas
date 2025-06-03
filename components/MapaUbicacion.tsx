'use client'

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api"
import { useCallback, useState } from "react"

const containerStyle = {
  width: '100%',
  height: '400px'
}

const center = { lat: 40.4168, lng: -3.7038 } // Ej: Madrid

export default function MapaUbicacion({
  onUbicacionSeleccionada,
  valorInicial
}: {
  onUbicacionSeleccionada: (lat: number, lng: number, direccion: string) => void,
  valorInicial?: { lat: number, lng: number }
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  })

  const [posicion, setPosicion] = useState(valorInicial || center)
  const [direccion, setDireccion] = useState("")

  const handleClick = useCallback(async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()

    setPosicion({ lat, lng })

    // Obtener dirección
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`)
    const data = await response.json()
    const dir = data.results?.[0]?.formatted_address || "Dirección no encontrada"
    setDireccion(dir)

    onUbicacionSeleccionada(lat, lng, dir)
  }, [onUbicacionSeleccionada])

  if (!isLoaded) return <p>Cargando mapa...</p>

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={posicion}
        zoom={13}
        onClick={handleClick}
      >
        <Marker position={posicion} />
      </GoogleMap>

     
    </>
  )
}