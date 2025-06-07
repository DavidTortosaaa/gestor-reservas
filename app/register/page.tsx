'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import MapaUbicacion from "@/components/MapaUbicacion"
import { showSuccess, showError } from "@/lib/toast"
import InputField from "@/components/ui/InputField"
import FormWrapper from "@/components/ui/FormWrapper"
import PrimaryButton from "@/components/ui/PrimaryButton"
import LabelledField from "@/components/ui/LabelledField"
import PageWrapper from "@/components/ui/PageWrapper" // 👈 Importar

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
      body: JSON.stringify({
        nombre,
        email,
        password,
        telefono,
        latitud,
        longitud,
        direccion,
      }),
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
    <PageWrapper> {/* 👈 Envolvemos todo */}
      <FormWrapper title="Crear cuenta">
        <form onSubmit={handleSubmit} className="space-y-4">
          <LabelledField label="Nombre:">
            <InputField
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </LabelledField>

          <LabelledField label="Correo electrónico:">
            <InputField
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelledField>

          <LabelledField label="Contraseña:">
            <InputField
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </LabelledField>

          <LabelledField label="Teléfono (opcional):">
            <InputField
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </LabelledField>

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

          <PrimaryButton type="submit">Registrarse</PrimaryButton>
        </form>
      </FormWrapper>
    </PageWrapper>
  )
}
