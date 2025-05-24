'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
   // Obtiene el estado de la sesión y los datos del usuario autenticado
  const { data: session, status } = useSession()

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">
        Gestor Reservas
      </Link>

      {/* Opciones de navegación */}
      <div className="space-x-4 flex items-center">
        
        <Link href="/negocios" className="text-gray-700 hover:text-blue-600">
          Mis negocios
        </Link>
        <Link href="/reservas" className="text-gray-700 hover:text-blue-600">
          Reservar
        </Link>

        {/* Opciones según el estado de la sesión */}
        {status === 'loading' ? (
          <p className="text-gray-500">Cargando...</p>
        ) : session ? (
          // Opciones para usuarios autenticados
          <>
            <Link href="/reservas/mis-reservas" className="text-gray-700 hover:text-blue-600">
              Mis Reservas
            </Link>
            <Link href="/perfil" className="text-gray-700 hover:text-blue-600">
              Mi Perfil
            </Link>
            <span className="text-sm text-gray-500">
              {session.user?.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-red-600 hover:text-red-800"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          // Opciones para usuarios no autenticados
          <>
            <Link href="/login" className="text-blue-600 hover:underline">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-blue-600 hover:underline">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}