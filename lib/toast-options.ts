// lib/toast-options.ts
import type { ToasterProps } from "react-hot-toast";

/**
 * Configuración global para las notificaciones (toasts) en el proyecto.
 * 
 * Este archivo define las opciones predeterminadas para las notificaciones,
 * incluyendo posición, estilo, duración y temas personalizados para los estados de éxito y error.
 */
export const toastOptions: ToasterProps = {
  /**
   * Posición de las notificaciones en la pantalla.
   * 
   * @value "top-right" - Las notificaciones aparecen en la esquina superior derecha.
   */
  position: "top-right",

  /**
   * Orden de las notificaciones.
   * 
   * @value false - Las notificaciones se muestran en el orden en que se generan.
   */
  reverseOrder: false,

  /**
   * Opciones generales para las notificaciones.
   */
  toastOptions: {
    /**
     * Duración de las notificaciones.
     * 
     * @value 3000 - Las notificaciones desaparecen después de 3 segundos.
     */
    duration: 3000,

    /**
     * Estilo predeterminado para las notificaciones.
     * 
     * Define colores, bordes, sombras y otros estilos visuales.
     */
    style: {
      backgroundColor: "#ffffff", // Fondo blanco
      color: "#1f2937", // Texto gris oscuro (gray-800)
      border: "1px solid #e5e7eb", // Borde gris claro (gray-200)
      padding: "12px 16px", // Espaciado interno
      fontSize: "0.875rem", // Tamaño de fuente pequeño (text-sm)
      borderRadius: "0.5rem", // Bordes redondeados (rounded-md)
      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)", // Sombra ligera
    },

    /**
     * Opciones específicas para notificaciones de éxito.
     * 
     * Define colores personalizados para el icono de éxito.
     */
    success: {
      iconTheme: {
        primary: "#10b981", // Verde (green-500)
        secondary: "#ecfdf5", // Fondo verde claro (green-50)
      },
    },

    /**
     * Opciones específicas para notificaciones de error.
     * 
     * Define colores personalizados para el icono de error.
     */
    error: {
      iconTheme: {
        primary: "#ef4444", // Rojo (red-500)
        secondary: "#fef2f2", // Fondo rojo claro (red-50)
      },
    },
  },
};
