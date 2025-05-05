"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditarNegocioForm({ negocio }: { negocio: any }) {
  const [nombre, setNombre] = useState(negocio.nombre);
  const [email, setEmail] = useState(negocio.email);
  const [telefono, setTelefono] = useState(negocio.telefono || "");
  const [direccion, setDireccion] = useState(negocio.direccion || "");
  const [horario_apertura, setHorarioApertura] = useState(negocio.horario_apertura);
  const [horario_cierre, setHorarioCierre] = useState(negocio.horario_cierre);
  const router = useRouter();

  //Llama a la API para actualizar un negocio
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/negocios/${negocio.id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre,
        email,
        telefono,
        direccion,
        horario_apertura,
        horario_cierre,
      }),
    });

    router.push("/negocios");
  };

  //Formulario para editar un negocio
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-black">Editar Negocio</h1>

      <input
        type="text"
        placeholder="Nombre del negocio"
        className="w-full border p-2 rounded text-black"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        className="w-full border p-2 rounded text-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Teléfono"
        className="w-full border p-2 rounded text-black"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />

      <input
        type="text"
        placeholder="Dirección"
        className="w-full border p-2 rounded text-black"
        value={direccion}
        onChange={(e) => setDireccion(e.target.value)}
      />

      <input
        type="time"
        placeholder="Horario de apertura"
        className="w-full border p-2 rounded text-black"
        value={horario_apertura}
        onChange={(e) => setHorarioApertura(e.target.value)}
        required
      />

      <input
        type="time"
        placeholder="Horario de cierre"
        className="w-full border p-2 rounded text-black"
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