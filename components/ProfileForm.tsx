'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MapaUbicacion from "@/components/MapaUbicacion";
import { showError, showSuccess } from "@/lib/toast";
import InputField from "@/components/ui/InputField";
import FormWrapper from "@/components/ui/FormWrapper";
import PrimaryButton from "@/components/ui/PrimaryButton";
import LabelledField from "@/components/ui/LabelledField";

/**
 * Componente PerfilForm
 * 
 * Este componente muestra un formulario para que el usuario pueda editar su perfil.
 * Permite actualizar información como nombre, teléfono, contraseña y ubicación.
 */
export default function PerfilForm() {
  /**
   * Estados locales para almacenar los datos del perfil.
   * 
   * Cada estado corresponde a un campo del formulario.
   */
  const [nombre, setNombre] = useState(""); // Nombre del usuario
  const [email, setEmail] = useState(""); // Correo electrónico del usuario
  const [telefono, setTelefono] = useState(""); // Teléfono del usuario
  const [nuevaPassword, setNuevaPassword] = useState(""); // Nueva contraseña
  const [confirmarPassword, setConfirmarPassword] = useState(""); // Confirmación de la nueva contraseña
  const [latitud, setLatitud] = useState<number | null>(null); // Latitud de la ubicación
  const [longitud, setLongitud] = useState<number | null>(null); // Longitud de la ubicación
  const [direccion, setDireccion] = useState(""); // Dirección del usuario
  const [cargando, setCargando] = useState(true); // Estado de carga mientras se obtiene el perfil
  const router = useRouter(); // Hook para manejar la navegación entre páginas

  /**
   * Efecto para cargar los datos del perfil del usuario desde el servidor.
   * 
   * Realiza una solicitud GET al servidor para obtener los datos del perfil.
   */
  useEffect(() => {
    const fetchPerfil = async () => {
      const res = await fetch("/api/perfil");
      if (!res.ok) {
        showError("Error al cargar el perfil");
        return;
      }
      const data = await res.json();
      setNombre(data.nombre);
      setEmail(data.email);
      setTelefono(data.telefono || "");
      setLatitud(data.latitud || null);
      setLongitud(data.longitud || null);
      setDireccion(data.direccion || "");
      setCargando(false);
    };

    fetchPerfil();
  }, []);

  /**
   * Maneja el envío del formulario.
   * 
   * Realiza una solicitud PATCH al servidor para actualizar los datos del perfil.
   * Muestra mensajes de éxito o error según el resultado de la solicitud.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (nuevaPassword && nuevaPassword !== confirmarPassword) {
      showError("Las contraseñas no coinciden");
      return;
    }

    const res = await fetch("/api/perfil", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre,
        telefono,
        password: nuevaPassword,
        latitud,
        longitud,
        direccion,
      }),
    });

    if (res.ok) {
      showSuccess("Perfil actualizado correctamente");
      router.refresh();
    } else {
      const error = await res.json();
      showError("Error al actualizar perfil: " + error.message);
    }
  };

  /**
   * Renderiza un mensaje de carga mientras se obtienen los datos del perfil.
   */
  if (cargando) return <p className="text-center mt-8 text-white">Cargando perfil...</p>;

  /**
   * Renderiza el formulario para editar el perfil del usuario.
   * 
   * Incluye campos para nombre, teléfono, contraseña y ubicación.
   */
  return (
    <FormWrapper title="Mi Perfil">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo para el nombre del usuario */}
        <LabelledField label="Nombre:">
          <InputField value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
        </LabelledField>

        {/* Campo para el correo electrónico (solo lectura) */}
        <LabelledField label="Email:">
          <input
            type="text"
            value={email}
            disabled
            className="block w-full border p-2 rounded bg-gray-100 text-gray-500"
            required
          />
        </LabelledField>

        {/* Campo para el teléfono */}
        <LabelledField label="Teléfono:">
          <InputField value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" />
        </LabelledField>

        {/* Campo para la nueva contraseña */}
        <LabelledField label="Nueva contraseña:">
          <InputField
            type="password"
            value={nuevaPassword}
            onChange={(e) => setNuevaPassword(e.target.value)}
            placeholder="Dejar en blanco si no cambia"
          />
        </LabelledField>

        {/* Campo para confirmar la nueva contraseña */}
        <LabelledField label="Confirmar contraseña:">
          <InputField
            type="password"
            value={confirmarPassword}
            onChange={(e) => setConfirmarPassword(e.target.value)}
            placeholder="Confirmar contraseña"
          />
        </LabelledField>

        {/* Campo para la ubicación */}
        <div>
          <p className="text-sm text-black mb-2">Introduce tu dirección:</p>
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

        {/* Botones para guardar cambios o cancelar */}
        <div className="flex justify-between items-center mt-6">
          <PrimaryButton type="submit">Guardar cambios</PrimaryButton>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-gray-600 underline hover:text-gray-800"
          >
            Cancelar
          </button>
        </div>
      </form>
    </FormWrapper>
  );
}
