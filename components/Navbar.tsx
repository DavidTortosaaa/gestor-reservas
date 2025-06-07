'use client'


import Link from 'next/link'
import { useSession} from 'next-auth/react'
import LogoutButton from './LogoutButton'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="w-full bg-white shadow-md px-6 py-6 flex justify-between items-center">
      {/* Logo / inicio */}
      <Link href="/" className="text-2xl font-bold text-blue-600">
        Gestor Reservas
      </Link>

      {/* Enlaces de navegación */}
      <div className="space-x-6 flex items-center text-lg">
        <Link href="/negocios" className="text-gray-700 hover:text-blue-600 transition-colors">
          Mis negocios
        </Link>
        <Link href="/reservas" className="text-gray-700 hover:text-blue-600 transition-colors">
          Reservar
        </Link>

        {status === 'loading' ? (
          <span className="text-gray-500">Cargando...</span>
        ) : session ? (
          <>
            <Link href="/reservas/mis-reservas" className="text-gray-700 hover:text-blue-600 transition-colors">
              Mis Reservas
            </Link>
            <Link href="/perfil" className="text-gray-700 hover:text-blue-600 transition-colors">
              Mi Perfil
            </Link>
            <span className="text-sm text-gray-500">{session.user?.email}</span>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link href="/login" className="text-blue-600 hover:underline transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/register" className="text-blue-600 hover:underline transition-colors">
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
