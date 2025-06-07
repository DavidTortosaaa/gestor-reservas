'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapaUbicacion from "@/components/MapaUbicacion";
import { showSuccess, showError } from "@/lib/toast";
import InputField from "@/components/ui/InputField";
import LabelledField from "@/components/ui/LabelledField";
import FormWrapper from "@/components/ui/FormWrapper";
import PrimaryButton from "@/components/ui/PrimaryButton";

/**
 * Componente NuevoNegocioForm
 * 
 * Este componente muestra un formulario para crear un nuevo negocio.
 * Permite ingresar información como nombre, correo, teléfono, ubicación y horarios.
 */
export default function NuevoNegocioForm() {
  /**
   * Estados locales para almacenar los datos del negocio.
   * 
   * Cada estado corresponde a un campo del formulario.
   */
  const [nombre, setNombre] = useState(""); // Nombre del negocio
  const [email, setEmail] = useState(""); // Correo electrónico del negocio
  const [telefono, setTelefono] = useState(""); // Teléfono del negocio
  const [direccion, setDireccion] = useState(""); // Dirección del negocio
  const [latitud, setLatitud] = useState<number | null>(null); // Latitud de la ubicación
  const [longitud, setLongitud] = useState<number | null>(null); // Longitud de la ubicación
  const [horarioApertura, setHorarioApertura] = useState(""); // Horario de apertura
  const [horarioCierre, setHorarioCierre] = useState(""); // Horario de cierre
  const router = useRouter(); // Hook para manejar la navegación entre páginas

  /**
   * Maneja el envío del formulario.
   * 
   * Realiza una solicitud POST al servidor para crear el negocio.
   * Muestra mensajes de éxito o error según el resultado de la solicitud.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    try {
      /**
       * Realiza la solicitud al servidor para crear el negocio.
       * 
       * @method POST - Crea un nuevo negocio en el servidor.
       * @headers Content-Type - Indica que el cuerpo de la solicitud está en formato JSON.
       * @body - Contiene los datos del negocio.
       */
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
      });

      if (res.ok) {
        /**
         * Muestra un mensaje de éxito si el negocio se crea correctamente.
         * Redirige al usuario a la lista de negocios.
         */
        showSuccess("Negocio creado correctamente");
        router.push("/negocios");
      } else {
        /**
         * Muestra un mensaje de error si la solicitud falla.
         */
        const error = await res.json();
        showError(`Error: ${error.message}`);
      }
    } catch (error) {
      /**
       * Manejo de errores inesperados.
       * Muestra un mensaje de error si ocurre un problema durante la solicitud.
       */
      showError("Ocurrió un error al crear el negocio");
    }
  };

  /**
   * Renderiza el formulario para crear un negocio.
   * 
   * Incluye campos para nombre, correo, teléfono, ubicación y horarios.
   */
  return (
    <FormWrapper title="Crear Negocio">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo para el nombre del negocio */}
        <LabelledField label="Nombre del negocio:">
          <InputField
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </LabelledField>

        {/* Campo para el correo electrónico */}
        <LabelledField label="Correo electrónico:">
          <InputField
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </LabelledField>

        {/* Campo para el teléfono */}
        <LabelledField label="Teléfono:">
          <InputField
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </LabelledField>

        {/* Campo para la ubicación */}
        <LabelledField label="Ubicación:">
          {direccion && (
            <p className="mt-2 text-sm text-gray-700">
              📍 Dirección actual: {direccion}
            </p>
          )}
          <MapaUbicacion
            onUbicacionSeleccionada={(lat, lng, dir) => {
              setLatitud(lat);
              setLongitud(lng);
              setDireccion(dir);
            }}
          />
        </LabelledField>

        {/* Campos para los horarios */}
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

        {/* Botón para enviar el formulario */}
        <PrimaryButton type="submit">Crear</PrimaryButton>
      </form>
    </FormWrapper>
  );
}
