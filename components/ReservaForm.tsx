'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import { showSuccess, showError } from "@/lib/toast";
import "react-datepicker/dist/react-datepicker.css";

import FormWrapper from "@/components/ui/FormWrapper";
import PrimaryButton from "@/components/ui/PrimaryButton";
import LabelledField from "@/components/ui/LabelledField";

type ReservaFormProps = {
  servicioId: string;
  duracion: number;
  apertura: string;
  cierre: string;
};

function generarHorasDisponibles(
  apertura: string,
  cierre: string,
  duracion: number,
  fecha: string,
  horasOcupadas: string[]
): string[] {
  if (!fecha) return [];

  const [horaA, minutoA] = apertura.split(":").map(Number);
  const [horaC, minutoC] = cierre.split(":").map(Number);

  const now = new Date();
  const fechaSel = new Date(fecha);
  const esHoy = now.toDateString() === fechaSel.toDateString();

  const start = new Date(fechaSel);
  start.setHours(horaA, minutoA, 0, 0);

  const end = new Date(fechaSel);
  end.setHours(horaC, minutoC, 0, 0);
  if (end <= start) end.setDate(end.getDate() + 1);

  const horas: string[] = [];
  const slot = new Date(start);

  while (slot.getTime() + duracion * 60000 <= end.getTime()) {
    const horaStr = slot.toTimeString().slice(0, 5);
    const disponible = !horasOcupadas.includes(horaStr);

    if ((!esHoy || slot.getTime() > now.getTime()) && disponible) {
      horas.push(horaStr);
    }

    slot.setMinutes(slot.getMinutes() + duracion);
  }

  return horas;
}

export default function ReservaForm({ servicioId, duracion, apertura, cierre }: ReservaFormProps) {
  const router = useRouter();
  const [fecha, setFecha] = useState<Date | null>(null);
  const [hora, setHora] = useState("");
  const [horasDisponibles, setHorasDisponibles] = useState<string[]>([]);

  useEffect(() => {
    const fetchHoras = async () => {
      if (!fecha) return;
      const fechaISO = fecha.toISOString().split("T")[0];

      const res = await fetch("/api/reservas/disponibilidad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicioId, fecha: fechaISO }),
      });

      const data = await res.json();
      const horas = generarHorasDisponibles(apertura, cierre, duracion, fechaISO, data.horasOcupadas || []);
      setHorasDisponibles(horas);
      setHora("");
    };

    fetchHoras();
  }, [fecha, servicioId, apertura, cierre, duracion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fecha || !hora) {
      showError("Selecciona fecha y hora");
      return;
    }

    const fechaISO = fecha.toISOString().split("T")[0];
    const fechaHora = new Date(`${fechaISO}T${hora}:00`);

    const res = await fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ servicioId, fechaHora, estado: "pendiente" }),
    });

    if (res.ok) {
      showSuccess("Reserva creada correctamente");
      router.push("/reservas/mis-reservas");
    } else {
      const error = await res.json();
      showError("Error al crear reserva: " + error.message);
    }
  };

  return (
    <FormWrapper title="Reservar servicio">
      <form onSubmit={handleSubmit} className="space-y-4">
        <LabelledField label="Fecha:">
          <DatePicker
            selected={fecha}
            onChange={(date) => setFecha(date)}
            minDate={new Date()}
            filterDate={(date) => date.getDay() !== 0 && date.getDay() !== 6}
            dateFormat="yyyy-MM-dd"
            placeholderText="Selecciona una fecha"
            className="w-full border p-2 rounded text-black"
            required
          />
        </LabelledField>

        <LabelledField label="Hora:">
          <select
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            required
            disabled={!fecha}
            className="w-full border p-2 rounded text-black"
          >
            <option value="">Selecciona una hora</option>
            {horasDisponibles.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </LabelledField>

        <PrimaryButton type="submit">
          Reservar
        </PrimaryButton>
      </form>
    </FormWrapper>
  );
}
