"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapaUbicacion from "@/components/MapaUbicacion";
import { showSuccess, showError } from "@/lib/toast";

export default function EditarNegocioForm({ negocio }: { negocio: any }) {
  const [nombre, setNombre] = useState(negocio.nombre);
  const [email, setEmail] = useState(negocio.email);
  const [telefono, setTelefono] = useState(negocio.telefono || "");
  const [direccion, setDireccion] = useState(negocio.direccion || "");
  const [latitud, setLatitud] = useState(negocio.latitud || null);
  const [longitud, setLongitud] = useState(negocio.longitud || null);
  const [horario_apertura, setHorarioApertura] = useState(negocio.horario_apertura);
  const [horario_cierre, setHorarioCierre] = useState(negocio.horario_cierre);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/negocios/${negocio.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        email,
        telefono,
        direccion,
        latitud,
        longitud,
        horario_apertura,
        horario_cierre,
      }),
    });

    if (res.ok) {
      showSuccess("Negocio actualizado correctamente");
      setTimeout(() => router.push("/negocios"), 1500);
    } else {
      const data = await res.json();
      showError(data.message || "Error al actualizar el negocio");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow text-black">
      <h1 className="text-2xl font-bold mb-4">Editar Negocio</h1>

      <input
        type="text"
        placeholder="Nombre del negocio"
        className="w-full border p-2 rounded"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        className="w-full border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Teléfono"
        className="w-full border p-2 rounded"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <div>
        {direccion && (
          <p className="mt-2 text-sm text-gray-700">📍 Dirección actual: {direccion}</p>
        )}
        <MapaUbicacion
          onUbicacionSeleccionada={(lat, lng, dir) => {
            setLatitud(lat);
            setLongitud(lng);
            setDireccion(dir);
          }}
          valorInicial={latitud && longitud ? { lat: latitud, lng: longitud } : undefined}
        />
      </div>

      <input
        type="time"
        placeholder="Horario de apertura"
        className="w-full border p-2 rounded"
        value={horario_apertura}
        onChange={(e) => setHorarioApertura(e.target.value)}
        required
      />

      <input
        type="time"
        placeholder="Horario de cierre"
        className="w-full border p-2 rounded"
        value={horario_cierre}
        onChange={(e) => setHorarioCierre(e.target.value)}
        required
      />

      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Guardar Cambios
      </button>
    </form>
  );
}
