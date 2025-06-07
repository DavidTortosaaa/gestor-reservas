import { toast } from "react-hot-toast";

/**
 * Muestra una notificación de éxito.
 * 
 * Utiliza la librería `react-hot-toast` para mostrar un mensaje de éxito en la interfaz.
 * 
 * @param message - Mensaje que se mostrará en la notificación.
 */
export const showSuccess = (message: string) => {
  toast.success(message);
};

/**
 * Muestra una notificación de error.
 * 
 * Utiliza la librería `react-hot-toast` para mostrar un mensaje de error en la interfaz.
 * 
 * @param message - Mensaje que se mostrará en la notificación.
 */
export const showError = (message: string) => {
  toast.error(message);
};