import './globals.css'
import Navbar from '@/components/Navbar'
import AuthProvider from '@/lib/auth'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Gestor de Reservas',
  description: 'Aplicación para gestión de reservas multinegocio',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
