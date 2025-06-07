import nodemailer from "nodemailer";

/**
 * Configuración del transportador de correo electrónico.
 * 
 * Utiliza el servicio de Gmail para enviar correos electrónicos. Las credenciales de autenticación
 * se obtienen de las variables de entorno configuradas en el proyecto.
 */
export const transporter = nodemailer.createTransport({
  /**
   * Servicio de correo utilizado.
   * 
   * @value "gmail" - Utiliza Gmail como servicio de correo.
   */
  service: "gmail",

  /**
   * Autenticación para el servicio de correo.
   * 
   * @property user - Dirección de correo electrónico del remitente.
   * @property pass - Contraseña o token de aplicación del remitente.
   */
  auth: {
    user: process.env.EMAIL_USER, // Dirección de correo electrónico del remitente
    pass: process.env.EMAIL_PASS, // Contraseña o token de aplicación
  },
});

/**
 * Función para enviar correos electrónicos.
 * 
 * Esta función utiliza el transportador configurado para enviar correos electrónicos
 * con los parámetros especificados.
 * 
 * @param to - Dirección de correo electrónico del destinatario.
 * @param subject - Asunto del correo electrónico.
 * @param html - Contenido HTML del correo electrónico.
 * 
 * @returns Una promesa que se resuelve cuando el correo se envía correctamente.
 */
export async function enviarCorreo({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  /**
   * Envía el correo electrónico utilizando el transportador configurado.
   * 
   * @property from - Dirección de correo electrónico del remitente (obtenida de las variables de entorno).
   * @property to - Dirección de correo electrónico del destinatario.
   * @property subject - Asunto del correo electrónico.
   * @property html - Contenido HTML del correo electrónico.
   */
  await transporter.sendMail({
    from: process.env.EMAIL_FROM, // Dirección de correo electrónico del remitente
    to, // Dirección de correo electrónico del destinatario
    subject, // Asunto del correo electrónico
    html, // Contenido HTML del correo electrónico
  });
}