'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

type EditarServicioFormProps = {
  servicio: {
    id: string;
    nombre: string;
    descripcion: string | null;
    duracion: number;
    precio: number;
    negocioId: string;
  };
};

export default function EditarServicioForm({ servicio }: EditarServicioFormProps) {
  const [nombre, setNombre] = useState(servicio.nombre);
  const [descripcion, setDescripcion] = useState(servicio.descripcion || "");
  const [duracion, setDuracion] = useState(servicio.duracion);
  const [precio, setPrecio] = useState(servicio.precio);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/servicios/${servicio.id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre,
        descripcion,
        duracion,
        precio,
      }),
    });

    if (res.ok) {
      router.push(`/negocios/${servicio.negocioId}/servicios`);
    } else {
      const error = await res.json();
      alert("Error al editar servicio: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Editar Servicio</h1>

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
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Guardar cambios
      </button>
    </form>
  );
}