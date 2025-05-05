import { PrismaClient } from '@prisma/client'; // Importa PrismaClient para interactuar con la base de datos

/**
 * Configuración global para Prisma Client
 * Este archivo asegura que solo exista una única instancia de Prisma Client en toda la aplicación,
 * evitando problemas en entornos de desarrollo donde el código puede recargarse frecuentemente.
 */

// Define un objeto global para almacenar la instancia de Prisma Client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined; // Prisma Client puede ser undefined si aún no se ha inicializado
};

/**
 * Instancia de Prisma Client
 * Si ya existe una instancia en el ámbito global, la reutiliza.
 * Si no existe, crea una nueva instancia de Prisma Client.
 * La opción `log: ['query']` habilita el registro de consultas SQL para depuración.
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Registra las consultas realizadas a la base de datos
  });

/**
 * Almacena la instancia de Prisma Client en el ámbito global en entornos de desarrollo.
 * Esto evita que se creen múltiples instancias durante el recargado del código.
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
