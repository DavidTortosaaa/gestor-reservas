'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import MapaUbicacion from "@/components/MapaUbicacion"
import { showSuccess, showError } from "@/lib/toast"

export default function RegisterPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [telefono, setTelefono] = useState("")
  const [latitud, setLatitud] = useState<number | null>(null)
  const [longitud, setLongitud] = useState<number | null>(null)
  const [direccion, setDireccion] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, telefono, latitud, longitud, direccion }),
    })

    const data = await res.json()

    if (res.ok) {
      showSuccess("Cuenta creada correctamente")
      router.push("/login")
    } else {
      showError(data.message || "Error al registrarse")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow text-black">
      <h1 className="text-2xl font-bold mb-4">Crear cuenta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {direccion && (
          <p className="text-sm text-gray-700">📍 Dirección: {direccion}</p>
        )}

        <MapaUbicacion
          onUbicacionSeleccionada={(lat, lng, dir) => {
            setLatitud(lat)
            setLongitud(lng)
            setDireccion(dir)
          }}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  )
}
