'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LogoutButton from './LogoutButton';

/**
 * Componente Navbar
 * 
 * Este componente muestra una barra de navegación en la parte superior de la página.
 * Incluye enlaces a diferentes secciones de la aplicación y un botón para cerrar sesión.
 * La barra de navegación se adapta según el estado de autenticación del usuario.
 */
export default function Navbar() {
  /**
   * Obtiene la sesión del usuario autenticado.
   * 
   * @property data - Contiene los datos de la sesión, como el email del usuario.
   * @property status - Indica el estado de la sesión: "loading", "authenticated" o "unauthenticated".
   */
  const { data: session, status } = useSession();

  /**
   * Renderiza la barra de navegación.
   * 
   * Incluye un logo, enlaces de navegación y opciones de autenticación.
   */
  return (
    <nav className="w-full bg-white shadow-md px-6 py-6 flex justify-between items-center">
      {/* Logo / inicio */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        Gestor Reservas
      </Link>

      {/* Enlaces de navegación */}
      <div className="space-x-6 flex items-center text-lg">
        {/* Enlace a la sección de negocios */}
        <Link href="/negocios" className="text-gray-700 hover:text-blue-600 transition-colors">
          Mis negocios
        </Link>

        {/* Enlace a la sección de reservas */}
        <Link href="/reservas" className="text-gray-700 hover:text-blue-600 transition-colors">
          Reservar
        </Link>

        {/* Estado de carga mientras se verifica la sesión */}
        {status === 'loading' ? (
          <span className="text-gray-500">Cargando...</span>
        ) : session ? (
          <>
            {/* Enlace a las reservas del usuario */}
            <Link href="/reservas/mis-reservas" className="text-gray-700 hover:text-blue-600 transition-colors">
              Mis Reservas
            </Link>

            {/* Enlace al perfil del usuario */}
            <Link href="/perfil" className="text-gray-700 hover:text-blue-600 transition-colors">
              Mi Perfil
            </Link>

            {/* Muestra el email del usuario autenticado */}
            <span className="text-sm text-gray-500">{session.user?.email}</span>

            {/* Botón para cerrar sesión */}
            <LogoutButton />
          </>
        ) : (
          <>
            {/* Enlace para iniciar sesión */}
            <Link href="/login" className="text-blue-600 hover:underline transition-colors">
              Iniciar sesión
            </Link>

            {/* Enlace para registrarse */}
            <Link href="/register" className="text-blue-600 hover:underline transition-colors">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
