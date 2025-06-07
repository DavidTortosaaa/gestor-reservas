'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import MapaUbicacion from "@/components/MapaUbicacion";
import { showSuccess, showError } from "@/lib/toast";
import InputField from "@/components/ui/InputField";
import FormWrapper from "@/components/ui/FormWrapper";
import PrimaryButton from "@/components/ui/PrimaryButton";
import LabelledField from "@/components/ui/LabelledField";
import PageWrapper from "@/components/ui/PageWrapper";

/**
 * Página RegisterPage
 * 
 * Esta página muestra un formulario para que los usuarios puedan registrarse.
 * Permite ingresar información como nombre, correo electrónico, contraseña, teléfono y ubicación.
 */
export default function RegisterPage() {
  const router = useRouter();

  /**
   * Estados locales para almacenar los datos del formulario de registro.
   * 
   * Cada estado corresponde a un campo del formulario.
   */
  const [nombre, setNombre] = useState(""); // Nombre del usuario
  const [email, setEmail] = useState(""); // Correo electrónico del usuario
  const [password, setPassword] = useState(""); // Contraseña del usuario
  const [telefono, setTelefono] = useState(""); // Teléfono del usuario (opcional)
  const [latitud, setLatitud] = useState<number | null>(null); // Latitud de la ubicación
  const [longitud, setLongitud] = useState<number | null>(null); // Longitud de la ubicación
  const [direccion, setDireccion] = useState(""); // Dirección del usuario

  /**
   * Maneja el envío del formulario.
   * 
   * Realiza una solicitud POST al servidor para registrar al usuario.
   * Muestra mensajes de éxito o error según el resultado de la solicitud.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      /**
       * Realiza la solicitud al servidor para registrar al usuario.
       * 
       * @method POST - Crea una nueva cuenta en el servidor.
       * @headers Content-Type - Indica que el cuerpo de la solicitud está en formato JSON.
       * @body - Contiene los datos del usuario.
       */
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password,
          telefono,
          latitud,
          longitud,
          direccion,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        /**
         * Muestra un mensaje de éxito si la cuenta se crea correctamente.
         * Redirige al usuario a la página de inicio de sesión.
         */
        showSuccess("Cuenta creada correctamente");
        router.push("/login");
      } else {
        /**
         * Muestra un mensaje de error si la solicitud falla.
         */
        showError(data.message || "Error al registrarse");
      }
    } catch (error) {
      /**
       * Manejo de errores inesperados.
       * Muestra un mensaje de error si ocurre un problema durante la solicitud.
       */
      showError("Ocurrió un error al registrarse");
    }
  };

  /**
   * Renderiza la página de registro.
   * 
   * Incluye un formulario para ingresar los datos del usuario y un mapa para seleccionar la ubicación.
   */
  return (
    <PageWrapper>
      <FormWrapper title="Crear cuenta">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo para el nombre del usuario */}
          <LabelledField label="Nombre:">
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
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </LabelledField>

          {/* Campo para la contraseña */}
          <LabelledField label="Contraseña:">
            <InputField
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </LabelledField>

          {/* Campo para el teléfono (opcional) */}
          <LabelledField label="Teléfono (opcional):">
            <InputField
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </LabelledField>

          {/* Dirección seleccionada */}
          {direccion && (
            <p className="text-sm text-gray-700">📍 Dirección: {direccion}</p>
          )}

          {/* Mapa para seleccionar la ubicación */}
          <MapaUbicacion
            onUbicacionSeleccionada={(lat, lng, dir) => {
              setLatitud(lat);
              setLongitud(lng);
              setDireccion(dir);
            }}
          />

          {/* Botón para enviar el formulario */}
          <PrimaryButton type="submit">Registrarse</PrimaryButton>
        </form>
      </FormWrapper>
    </PageWrapper>
  );
}
