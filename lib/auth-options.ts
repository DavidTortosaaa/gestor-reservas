import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcryptjs";

/**
 * Opciones de configuración para NextAuth
 */
export const authOptions: NextAuthOptions = {
  /**
   * Adaptador de Prisma para conectar NextAuth con la base de datos.
   */
  adapter: PrismaAdapter(prisma),

  /**
   * Proveedores de autenticación.
   * En este caso, se utiliza un proveedor de credenciales personalizado.
   */
  providers: [
    CredentialsProvider({
      name: "credentials", // Nombre del proveedor
      credentials: {
        email: { label: "Email", type: "text" }, // Campo para el email
        password: { label: "Password", type: "password" }, // Campo para la contraseña
      },
      /**
       * Función para autorizar al usuario.
       * Valida las credenciales ingresadas (email y contraseña).
       */
      async authorize(credentials) {
        // Verifica que las credenciales estén presentes
        if (!credentials?.email || !credentials?.password) return null;

        // Busca al usuario en la base de datos por email
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });

        // Si el usuario no existe, retorna null
        if (!user) return null;

        // Compara la contraseña ingresada con la almacenada en la base de datos
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;

        // Devuelve los datos del usuario si las credenciales son válidas
        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
        };
      },
    }),
  ],

  /**
   * Configuración de la sesión.
   * Se utiliza JWT (JSON Web Tokens) para gestionar las sesiones.
   */
  session: {
    strategy: "jwt",
  },

  /**
   * Páginas personalizadas.
   * Define la ruta para la página de inicio de sesión.
   */
  pages: {
    signIn: "/login", // Ruta personalizada para la página de inicio de sesión
  },

  /**
   * Callbacks para personalizar el contenido de los tokens y las sesiones.
   */
  callbacks: {
    /**
     * Callback para personalizar el token JWT.
     * Si el usuario está autenticado, agrega su ID al token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    /**
     * Callback para personalizar la sesión.
     * Agrega el ID del usuario al objeto de sesión.
     */
    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
