'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [telefono, setTelefono] = useState("")
  const [error, setError] = useState("")

  //llamada a la API para registrar al usuario

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password, telefono }),
    })

    if (res.ok) {
      router.push("/login")
    } else {
      const data = await res.json()
      setError(data.message || "Error al registrarse")
    }
  }

  // Formulario de registro
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Crear cuenta</h1>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />
        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full border p-2 rounded text-black"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Registrarse
        </button>
      </form>
    </div>
  )
}