'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type ReservaFormProps = {
  servicioId: string
  duracion: number
  apertura: string
  cierre: string
}

function generarHorasDisponibles(apertura: string, cierre: string, duracion: number, fecha: string, horasOcupadas: string[]): string[] {
  if (!fecha) return []

  const [horaA, minutoA] = apertura.split(":").map(Number)
  const [horaC, minutoC] = cierre.split(":").map(Number)

  const now = new Date()
  const fechaSel = new Date(fecha)

  const esHoy = now.toDateString() === fechaSel.toDateString()

  const start = new Date(fechaSel)
  start.setHours(horaA, minutoA, 0, 0)

  const end = new Date(fechaSel)
  end.setHours(horaC, minutoC, 0, 0)

  const horas: string[] = []
  const slot = new Date(start)

  while (slot.getTime() + duracion * 60000 <= end.getTime()) {
    const horaStr = slot.toTimeString().slice(0, 5)
    const disponible = !horasOcupadas.includes(horaStr)

    if ((!esHoy || slot.getTime() > now.getTime()) && disponible) {
      horas.push(horaStr)
    }

    slot.setMinutes(slot.getMinutes() + duracion)
  }

  return horas
}

export default function ReservaForm({ servicioId, duracion, apertura, cierre }: ReservaFormProps) {
  const router = useRouter()
  const [fecha, setFecha] = useState("")
  const [hora, setHora] = useState("")
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([])

  useEffect(() => {
    const fetchHoras = async () => {
      if (!fecha) return

      const res = await fetch("/api/reservas/disponibilidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicioId, fecha }),
      })

      const data = await res.json()
      const horas = generarHorasDisponibles(apertura, cierre, duracion, fecha, data.horasOcupadas || [])
      setHorasDisponibles(horas)
      setHora("") // Reset al cambiar fecha
    }

    fetchHoras()
  }, [fecha, servicioId, apertura, cierre, duracion])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fecha || !hora) return alert("Selecciona fecha y hora")

    const fechaHora = new Date(`${fecha}T${hora}:00`)

    const res = await fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servicioId,fechaHora, estado: "pendiente" }),
    })

    if (res.ok) {
      alert("Reserva creada correctamente")
      router.push("/reservas/mis-reservas")
    } else {
      const error = await res.json()
      alert("Error al crear reserva: " + error.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <label className="block">
        Fecha:
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
          min={new Date().toISOString().split("T")[0]}
          className="block w-full mt-1 border p-2 rounded text-black"
        />
      </label>

      <label className="block ">
        Hora:
        <select
          value={hora}
          onChange={(e) => setHora(e.target.value)}
          required
          disabled={!fecha}
          className="block w-full mt-1 border p-2 rounded text-black"
        >
          <option value="">Selecciona una hora</option>
          {horasDisponibles.map(h => (
            <option key={h} value={h}>{h}</option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Reservar
      </button>
    </form>
  )
}
//estilo