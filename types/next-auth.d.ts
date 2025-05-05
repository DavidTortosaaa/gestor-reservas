import NextAuth, { DefaultSession } from "next-auth"; 


declare module "next-auth" {
  /**
   * Extiende la interfaz `Session` de NextAuth
   * Agrega el campo `id` al objeto `user` dentro de la sesión.
   * Esto permite acceder al identificador único del usuario autenticado desde el contexto de sesión.
   */
  interface Session {
    user: {
      id: string; 
    } & DefaultSession["user"]; // Combina los campos personalizados con los predeterminados de NextAuth
  }

  /**
   * Extiende la interfaz `User` de NextAuth
   * Agrega el campo `id` al objeto `User`, asegurando que el identificador único del usuario
   * esté disponible en todas las operaciones relacionadas con el usuario.
   */
  interface User {
    id: string; 
  }
}