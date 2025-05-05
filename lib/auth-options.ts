/**
 * Configuración de opciones para NextAuth.js
 * Este archivo define cómo se maneja la autenticación en la aplicación,
 * incluyendo el adaptador de base de datos, los proveedores de autenticación,
 * la estrategia de sesión y las páginas personalizadas.
 */

import { PrismaAdapter } from "@next-auth/prisma-adapter"; // Adaptador para integrar Prisma con NextAuth
import { NextAuthOptions } from "next-auth"; // Tipo que define las opciones de configuración de NextAuth
import CredentialsProvider from "next-auth/providers/credentials"; // Proveedor de autenticación con credenciales personalizadas
import { prisma } from "./prisma"; // Instancia de Prisma Client para interactuar con la base de datos
import { compare } from "bcryptjs"; // Función para comparar contraseñas en texto plano con hashes

/**
 * Opciones de configuración para NextAuth
 */
export const authOptions: NextAuthOptions = {
  /**
   * Adaptador de Prisma
   * Permite que NextAuth almacene y gestione datos de autenticación (usuarios, sesiones, etc.)
   * directamente en la base de datos definida en el esquema de Prisma.
   */
  adapter: PrismaAdapter(prisma),

  /**
   * Proveedores de autenticación
   * Define los métodos que los usuarios pueden utilizar para autenticarse.
   * En este caso, se utiliza un proveedor de credenciales personalizado.
   */
  providers: [
    CredentialsProvider({
      name: "credentials", 
      credentials: {
        email: { label: "Email", type: "text" }, // Campo para el email del usuario
        password: { label: "Password", type: "password" }, // Campo para la contraseña del usuario
      },
      /**
       * Función de autorización
       * Valida las credenciales proporcionadas por el usuario.
       * @param credentials - Credenciales ingresadas por el usuario (email y contraseña)
       * @returns El objeto del usuario si las credenciales son válidas, o null si no lo son
       */
      async authorize(credentials) {
        // Verifica que se hayan proporcionado email y contraseña
        if (!credentials?.email || !credentials?.password) return null;

        // Busca al usuario en la base de datos por su email
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });

        // Si el usuario no existe, devuelve null (autenticación fallida)
        if (!user) return null;

        // Compara la contraseña proporcionada con el hash almacenado en la base de datos
        const isValid = await compare(credentials.password, user.password);

        // Si la contraseña no es válida, devuelve null (autenticación fallida)
        if (!isValid) return null;

        // Si las credenciales son válidas, devuelve el objeto del usuario
        return user;
      },
    }),
  ],

  /**
   * Configuración de la sesión
   * Define cómo se gestionan las sesiones de los usuarios.
   */
  session: {
    strategy: "jwt", // Utiliza JSON Web Tokens (JWT) para gestionar las sesiones
  },

  /**
   * Páginas personalizadas
   * Permite personalizar las rutas de las páginas de autenticación.
   */
  pages: {
    signIn: "/login", // Ruta personalizada para la página de inicio de sesión
  },
};