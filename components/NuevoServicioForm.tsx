'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";
import InputField from "@/components/ui/InputField";
import LabelledField from "@/components/ui/LabelledField";
import PrimaryButton from "@/components/ui/PrimaryButton";

type NuevoServicioFormProps = {
  negocioId: string;
};

export default function NuevoServicioForm({ negocioId }: NuevoServicioFormProps) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState(30);
  const [precio, setPrecio] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/servicios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        descripcion,
        duracion,
        precio,
        negocioId,
      }),
    });

    if (res.ok) {
      showSuccess("Servicio creado correctamente");
      router.push(`/negocios/${negocioId}/servicios`);
    } else {
      const error = await res.json();
      showError("Error al crear servicio: " + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow text-black"
    >
      <h1 className="text-2xl font-bold mb-4">Crear nuevo servicio</h1>

      <LabelledField label="Nombre del servicio:">
        <InputField
          placeholder="Nombre del servicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </LabelledField>

      <LabelledField label="Descripción (opcional):">
        <textarea
          placeholder="Descripción"
          className="w-full border p-2 rounded text-black"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </LabelledField>

      <LabelledField label="Duración (minutos):">
        <InputField
          type="number"
          value={duracion.toString()}
          onChange={(e) => setDuracion(Number(e.target.value))}
          required
        />
      </LabelledField>

      <LabelledField label="Precio (€):">
        <InputField
          type="number"
          value={precio.toString()}
          onChange={(e) => setPrecio(Number(e.target.value))}
          required
        />
      </LabelledField>

      <PrimaryButton type="submit">Crear Servicio</PrimaryButton>
    </form>
  );
}
