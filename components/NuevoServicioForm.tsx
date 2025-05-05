'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

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
      body: JSON.stringify({
        nombre,
        descripcion,
        duracion,
        precio,
        negocioId,
      }),
    });

    if (res.ok) {
      router.push(`/negocios/${negocioId}/servicios`);
    } else {
      const error = await res.json();
      alert("Error al crear servicio: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Crear nuevo servicio</h1>

      <input
        type="text"
        placeholder="Nombre del servicio"
        className="w-full border p-2 rounded text-black"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <textarea
        placeholder="Descripción (opcional)"
        className="w-full border p-2 rounded text-black"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <input
        type="number"
        placeholder="Duración en minutos"
        className="w-full border p-2 rounded text-black"
        value={duracion}
        onChange={(e) => setDuracion(Number(e.target.value))}
        required
      />

      <input
        type="number"
        placeholder="Precio (€)"
        className="w-full border p-2 rounded text-black"
        value={precio}
        onChange={(e) => setPrecio(Number(e.target.value))}
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Crear Servicio
      </button>
    </form>
  );
}