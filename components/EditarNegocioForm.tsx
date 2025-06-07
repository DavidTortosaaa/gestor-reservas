"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapaUbicacion from "@/components/MapaUbicacion";
import { showSuccess, showError } from "@/lib/toast";
import FormWrapper from "@/components/ui/FormWrapper";
import LabelledField from "@/components/ui/LabelledField";
import InputField from "@/components/ui/InputField";
import PrimaryButton from "@/components/ui/PrimaryButton";

/**
 * Componente EditarNegocioForm
 * 
 * Este componente muestra un formulario para editar los detalles de un negocio.
 * Permite actualizar información como nombre, correo, teléfono, ubicación y horarios.
 */
export default function EditarNegocioForm({ negocio }: { negocio: any }) {
  /**
   * Estados locales para almacenar los datos del negocio.
   * 
   * Cada estado corresponde a un campo del formulario.
   */
  const [nombre, setNombre] = useState(negocio.nombre); // Nombre del negocio
  const [email, setEmail] = useState(negocio.email); // Correo electrónico del negocio
  const [telefono, setTelefono] = useState(negocio.telefono || ""); // Teléfono del negocio
  const [direccion, setDireccion] = useState(negocio.direccion || ""); // Dirección del negocio
  const [latitud, setLatitud] = useState(negocio.latitud || null); // Latitud de la ubicación
  const [longitud, setLongitud] = useState(negocio.longitud || null); // Longitud de la ubicación
  const [horario_apertura, setHorarioApertura] = useState(negocio.horario_apertura); // Horario de apertura
  const [horario_cierre, setHorarioCierre] = useState(negocio.horario_cierre); // Horario de cierre
  const router = useRouter(); // Hook para manejar la navegación entre páginas

  /**
   * Maneja el envío del formulario.
   * 
   * Realiza una solicitud PUT al servidor para actualizar los datos del negocio.
   * Muestra mensajes de éxito o error según el resultado de la solicitud.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    try {
      /**
       * Realiza la solicitud al servidor para actualizar el negocio.
       * 
       * @method PUT - Actualiza los datos del negocio en el servidor.
       * @headers Content-Type - Indica que el cuerpo de la solicitud está en formato JSON.
       * @body - Contiene los datos actualizados del negocio.
       */
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
        /**
         * Muestra un mensaje de éxito si el negocio se actualiza correctamente.
         * Redirige al usuario a la página de negocios después de un breve retraso.
         */
        showSuccess("Negocio actualizado correctamente");
        setTimeout(() => router.push("/negocios"), 1500);
      } else {
        /**
         * Muestra un mensaje de error si la solicitud falla.
         */
        const data = await res.json();
        showError(data.message || "Error al actualizar el negocio");
      }
    } catch (error) {
      /**
       * Manejo de errores inesperados.
       * Muestra un mensaje de error si ocurre un problema durante la solicitud.
       */
      showError("Ocurrió un error al actualizar el negocio");
    }
  };

  /**
   * Renderiza el formulario para editar el negocio.
   * 
   * Incluye campos para nombre, correo, teléfono, ubicación y horarios.
   */
  return (
    <FormWrapper title="Editar Negocio">
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
        </LabelledField>

        {/* Campos para los horarios */}
        <div className="flex gap-4">
          <LabelledField label="Horario de apertura:">
            <input
              type="time"
              className="w-full border p-2 rounded text-black"
              value={horario_apertura}
              onChange={(e) => setHorarioApertura(e.target.value)}
              required
            />
          </LabelledField>

          <LabelledField label="Horario de cierre:">
            <input
              type="time"
              className="w-full border p-2 rounded text-black"
              value={horario_cierre}
              onChange={(e) => setHorarioCierre(e.target.value)}
              required
            />
          </LabelledField>
        </div>

        {/* Botón para guardar los cambios */}
        <PrimaryButton type="submit">Guardar Cambios</PrimaryButton>
      </form>
    </FormWrapper>
  );
}
