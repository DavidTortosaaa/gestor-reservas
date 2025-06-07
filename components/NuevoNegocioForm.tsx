'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import MapaUbicacion from "@/components/MapaUbicacion"
import { showSuccess, showError } from "@/lib/toast"
import InputField from "@/components/ui/InputField"
import LabelledField from "@/components/ui/LabelledField"
import FormWrapper from "@/components/ui/FormWrapper"
import PrimaryButton from "@/components/ui/PrimaryButton"

export default function NuevoNegocioForm() {
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
        horario_cierre: horarioCierre,
      }),
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
    <FormWrapper title="Crear Negocio">
      <form onSubmit={handleSubmit} className="space-y-4">
        <LabelledField label="Nombre del negocio:">
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
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </LabelledField>

        <LabelledField label="Teléfono:">
          <InputField
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </LabelledField>

        <LabelledField label="Ubicación:">
          {direccion && (
            <p className="mt-2 text-sm text-gray-700">
              📍 Dirección actual: {direccion}
            </p>
          )}
          <MapaUbicacion
            onUbicacionSeleccionada={(lat, lng, dir) => {
              setLatitud(lat)
              setLongitud(lng)
              setDireccion(dir)
            }}
          />
        </LabelledField>

        <div className="flex gap-4">
          <LabelledField label="Apertura:">
            <input
              type="time"
              value={horarioApertura}
              onChange={(e) => setHorarioApertura(e.target.value)}
              className="w-full border p-2 rounded text-black"
              required
            />
          </LabelledField>

          <LabelledField label="Cierre:">
            <input
              type="time"
              value={horarioCierre}
              onChange={(e) => setHorarioCierre(e.target.value)}
              className="w-full border p-2 rounded text-black"
              required
            />
          </LabelledField>
        </div>

        <PrimaryButton type="submit">Crear</PrimaryButton>
      </form>
    </FormWrapper>
  )
}
