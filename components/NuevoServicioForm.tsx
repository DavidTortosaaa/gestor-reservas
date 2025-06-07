'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";
import InputField from "@/components/ui/InputField";
import LabelledField from "@/components/ui/LabelledField";
import PrimaryButton from "@/components/ui/PrimaryButton";

type NuevoServicioFormProps = {
  negocioId: string; // ID único del negocio al que se asociará el servicio
};

/**
 * Componente NuevoServicioForm
 * 
 * Este componente muestra un formulario para crear un nuevo servicio.
 * Permite ingresar información como nombre, descripción, duración y precio.
 */
export default function NuevoServicioForm({ negocioId }: NuevoServicioFormProps) {
  /**
   * Estados locales para almacenar los datos del servicio.
   * 
   * Cada estado corresponde a un campo del formulario.
   */
  const [nombre, setNombre] = useState(""); // Nombre del servicio
  const [descripcion, setDescripcion] = useState(""); // Descripción del servicio
  const [duracion, setDuracion] = useState(30); // Duración del servicio en minutos
  const [precio, setPrecio] = useState(0); // Precio del servicio en euros
  const router = useRouter(); // Hook para manejar la navegación entre páginas

  /**
   * Maneja el envío del formulario.
   * 
   * Realiza una solicitud POST al servidor para crear el servicio.
   * Muestra mensajes de éxito o error según el resultado de la solicitud.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    try {
      /**
       * Realiza la solicitud al servidor para crear el servicio.
       * 
       * @method POST - Crea un nuevo servicio en el servidor.
       * @headers Content-Type - Indica que el cuerpo de la solicitud está en formato JSON.
       * @body - Contiene los datos del servicio.
       */
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
        /**
         * Muestra un mensaje de éxito si el servicio se crea correctamente.
         * Redirige al usuario a la lista de servicios del negocio.
         */
        showSuccess("Servicio creado correctamente");
        router.push(`/negocios/${negocioId}/servicios`);
      } else {
        /**
         * Muestra un mensaje de error si la solicitud falla.
         */
        const error = await res.json();
        showError("Error al crear servicio: " + error.message);
      }
    } catch (error) {
      /**
       * Manejo de errores inesperados.
       * Muestra un mensaje de error si ocurre un problema durante la solicitud.
       */
      showError("Ocurrió un error al crear el servicio");
    }
  };

  /**
   * Renderiza el formulario para crear un servicio.
   * 
   * Incluye campos para nombre, descripción, duración y precio.
   */
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-lg mx-auto bg-white p-6 rounded shadow text-black"
    >
      {/* Título del formulario */}
      <h1 className="text-2xl font-bold mb-4">Crear nuevo servicio</h1>

      {/* Campo para el nombre del servicio */}
      <LabelledField label="Nombre del servicio:">
        <InputField
          placeholder="Nombre del servicio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
      </LabelledField>

      {/* Campo para la descripción del servicio */}
      <LabelledField label="Descripción (opcional):">
        <textarea
          placeholder="Descripción"
          className="w-full border p-2 rounded text-black"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </LabelledField>

      {/* Campo para la duración del servicio */}
      <LabelledField label="Duración (minutos):">
        <InputField
          type="number"
          value={duracion.toString()}
          onChange={(e) => setDuracion(Number(e.target.value))}
          required
        />
      </LabelledField>

      {/* Campo para el precio del servicio */}
      <LabelledField label="Precio (€):">
        <InputField
          type="number"
          value={precio.toString()}
          onChange={(e) => setPrecio(Number(e.target.value))}
          required
        />
      </LabelledField>

      {/* Botón para enviar el formulario */}
      <PrimaryButton type="submit">Crear Servicio</PrimaryButton>
    </form>
  );
}
