'use client'

import { signIn } from "next-auth/react" // Función de NextAuth para manejar el inicio de sesión
import { useState } from "react" // Hook de React para manejar el estado local


export default function LoginPage() {
  // Estado local para almacenar los valores de los campos del formulario
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //Llama a la función `signIn` de NextAuth para autenticar al usuario.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/"
    })
  }

  //Formulario
  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full border p-2 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full border p-2 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Entrar
        </button>
      </form>
    </div>
  )
}