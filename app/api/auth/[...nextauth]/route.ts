import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"

/**
 * Configuración de NextAuth para la autenticación en la aplicación.
 * 
 * Este archivo define los proveedores de autenticación, la estrategia de sesión,
 * las páginas personalizadas y otros ajustes necesarios para NextAuth.
 */
const handler = NextAuth({
  /**
   * Proveedores de autenticación.
   * En este caso, se utiliza un proveedor de credenciales personalizado.
   */
  providers: [
    CredentialsProvider({
      name: "credentials", // Nombre del proveedor
      credentials: {
        email: { label: "Email", type: "text" }, // Campo para el email
        password: { label: "Password", type: "password" } // Campo para la contraseña
      },
      /**
       * Función para autorizar al usuario.
       * Valida las credenciales ingresadas (email y contraseña).
       * 
       * @param credentials - Credenciales ingresadas por el usuario
       * @returns Un objeto con los datos del usuario si las credenciales son válidas, o null si no lo son.
       */
      async authorize(credentials) {
        // Verifica que las credenciales estén presentes
        if (!credentials?.email || !credentials?.password) return null

        // Busca al usuario en la base de datos por email
        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email }
        })

        // Si el usuario no existe, retorna null
        if (!user) return null

        // Compara la contraseña ingresada con la almacenada en la base de datos
        const passwordValid = await compare(credentials.password, user.password)
        if (!passwordValid) return null

        // Devuelve los datos del usuario si las credenciales son válidas
        return {
          id: user.id,
          email: user.email,
          name: user.nombre
        }
      },
    }),
  ],

  /**
   * Configuración de la sesión.
   * Se utiliza JWT (JSON Web Tokens) para gestionar las sesiones.
   */
  session: {
    strategy: "jwt" // Estrategia de sesión basada en tokens JWT
  },

  /**
   * Páginas personalizadas.
   * Define la ruta para la página de inicio de sesión.
   */
  pages: {
    signIn: "/login" // Ruta personalizada para la página de inicio de sesión
  },

  /**
   * Secreto utilizado para firmar los tokens JWT.
   * Este valor debe estar definido en las variables de entorno.
   */
  secret: process.env.NEXTAUTH_SECRET
})

/**
 * Exporta los métodos HTTP GET y POST para manejar las solicitudes de autenticación.
 */
export { handler as GET, handler as POST }