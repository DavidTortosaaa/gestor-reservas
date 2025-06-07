import type { Config } from "tailwindcss";

/**
 * Configuración de TailwindCSS para el proyecto Gestor de Reservas.
 * 
 * Este archivo define las rutas de contenido, extiende el tema con colores personalizados,
 * fuentes y configura plugins adicionales para mejorar la funcionalidad de TailwindCSS.
 */
const config: Config = {
  /**
   * Rutas de contenido.
   * 
   * TailwindCSS escanea estos archivos para generar las clases CSS necesarias.
   */
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Archivos en la carpeta "app"
    "./components/**/*.{js,ts,jsx,tsx}", // Archivos en la carpeta "components"
  ],
  theme: {
    /**
     * Extensiones del tema.
     * 
     * Define colores personalizados y fuentes para el proyecto.
     */
    extend: {
      colors: {
        /**
         * Colores personalizados.
         * 
         * Los valores se obtienen de variables CSS definidas en el proyecto.
         */
        background: "var(--background)", // Color de fondo
        foreground: "var(--foreground)", // Color de texto
      },
      fontFamily: {
        /**
         * Fuentes personalizadas.
         * 
         * Las fuentes se obtienen de variables CSS y se configuran como opciones principales.
         */
        sans: ["var(--font-sans)", "sans-serif"], // Fuente sans-serif
        mono: ["var(--font-mono)", "monospace"], // Fuente monospace
      },
    },
  },
  /**
   * Plugins de TailwindCSS.
   * 
   * Añade funcionalidades adicionales para formularios, tipografía y proporciones de aspecto.
   */
  plugins: [
    require("@tailwindcss/forms"), // Estilos para formularios
    require("@tailwindcss/typography"), // Estilos para tipografía avanzada
    require("@tailwindcss/aspect-ratio"), // Utilidades para proporciones de aspecto
  ],
};

export default config;