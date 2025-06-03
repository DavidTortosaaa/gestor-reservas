'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MapaUbicacion from "@/components/MapaUbicacion"
import { showError, showSuccess } from "@/lib/toast"

export default function PerfilForm() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [confirmarPassword, setConfirmarPassword] = useState("")
  const [latitud, setLatitud] = useState<number | null>(null)
  const [longitud, setLongitud] = useState<number | null>(null)
  const [direccion, setDireccion] = useState("")
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchPerfil = async () => {
      const res = await fetch("/api/perfil")
      if (!res.ok) {
        showError("Error al cargar el perfil")
        return
      }
      const data = await res.json()
      setNombre(data.nombre)
      setEmail(data.email)
      setTelefono(data.telefono || "")
      setLatitud(data.latitud || null)
      setLongitud(data.longitud || null)
      setDireccion(data.direccion || "")
      setCargando(false)
    }

    fetchPerfil()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (nuevaPassword && nuevaPassword !== confirmarPassword) {
      showError("Las contraseñas no coinciden")
      return
    }

    const res = await fetch("/api/perfil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        telefono,
        password: nuevaPassword,
        latitud,
        longitud,
        direccion
      }),
    })

    if (res.ok) {
      showSuccess("Perfil actualizado correctamente")
      router.refresh()
    } else {
      const error = await res.json()
      showError("Error al actualizar perfil: " + error.message)
    }
  }

  if (cargando) return <p className="text-center mt-8">Cargando perfil...</p>

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow text-black">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="block w-full mt-1 border p-2 rounded"
            required
          />
        </label>

        <label className="block">
          Email:
          <input
            type="text"
            value={email}
            disabled
            className="block w-full mt-1 border p-2 rounded bg-gray-100 text-gray-500"
          />
        </label>

        <label className="block">
          Teléfono:
          <input
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="block w-full mt-1 border p-2 rounded"
          />
        </label>

        <label className="block">
          Nueva contraseña:
          <input
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            className="block w-full mt-1 border p-2 rounded"
            placeholder="Dejar en blanco si no cambia"
          />
        </label>

        <label className="block">
          Confirmar contraseña:
          <input
            type="password"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            className="block w-full mt-1 border p-2 rounded"
          />
        </label>

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
            valorInicial={latitud && longitud ? { lat: latitud, lng: longitud } : undefined}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Guardar cambios
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 underline hover:text-gray-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
