'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import MapaUbicacion from "@/components/MapaUbicacion"
import { showSuccess, showError } from "@/lib/toast"

export default function CrearNegocioPage() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [latitud, setLatitud] = useState<number | null>(null)
  const [longitud, setLongitud] = useState<number | null>(null)
  const [horarioApertura, setHorarioApertura] = useState("")
  const [horarioCierre, setHorarioCierre] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/negocios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        email,
        telefono,
        direccion,
        latitud,
        longitud,
        horario_apertura: horarioApertura,
        horario_cierre: horarioCierre
      })
    })

    if (res.ok) {
      showSuccess("Negocio creado correctamente")
      router.push("/negocios")
    } else {
      const error = await res.json()
      showError(`Error: ${error.message}`)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow text-black">
      <h1 className="text-2xl font-bold mb-4">Crear Negocio</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del negocio"
          className="w-full border p-2 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email del negocio"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          className="w-full border p-2 rounded"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <div>
          Introduzca su dirección:
          {direccion && (
            <p className="mt-2 text-sm text-gray-700">📍 Dirección actual: {direccion}</p>
          )}
          <MapaUbicacion
            onUbicacionSeleccionada={(lat, lng, dir) => {
              setLatitud(lat)
              setLongitud(lng)
              setDireccion(dir)
            }}
          />
        </div>
        <div className="flex gap-2">
          <input
            type="time"
            className="w-1/2 border p-2 rounded"
            value={horarioApertura}
            onChange={(e) => setHorarioApertura(e.target.value)}
          />
          <input
            type="time"
            className="w-1/2 border p-2 rounded"
            value={horarioCierre}
            onChange={(e) => setHorarioCierre(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crear
        </button>
      </form>
    </div>
  )
}
