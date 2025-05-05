'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CrearNegocioPage() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [direccion, setDireccion] = useState("")
  const [horarioApertura, setHorarioApertura] = useState("")
  const [horarioCierre, setHorarioCierre] = useState("")
  const router = useRouter()

  //Llama a la API para crear un nuevo negocio
  // y redirige a la página de negocios
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
        horario_apertura: horarioApertura,
        horario_cierre: horarioCierre
      })
    })

    if (res.ok) {
      router.push("/negocios")
    } else {
      const error = await res.json()
      alert(`Error: ${error.message}`)
    }
  }

  //Formulario para crear un nuevo negocio

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Crear Negocio</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre del negocio"
          className="w-full border p-2 rounded text-black"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email del negocio"
          className="w-full border p-2 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          className="w-full border p-2 rounded text-black"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección"
          className="w-full border p-2 rounded text-black"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <div className="flex gap-2">
          <input
            type="time"
            className="w-1/2 border p-2 rounded text-black"
            value={horarioApertura}
            onChange={(e) => setHorarioApertura(e.target.value)}
          />
          <input
            type="time"
            className="w-1/2 border p-2 rounded text-black"
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