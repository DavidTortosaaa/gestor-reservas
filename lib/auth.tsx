"use client"; // Indica que este archivo es un componente del lado del cliente en Next.js

import { SessionProvider } from "next-auth/react"; // Proveedor de sesión de NextAuth para gestionar el estado de autenticación

/**
 * Componente AuthProvider
 * Este componente envuelve la jerarquía de componentes de la aplicación con el `SessionProvider`
 * de NextAuth, permitiendo que los componentes hijos accedan al contexto de sesión.
 */
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
