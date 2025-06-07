'use client'

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { showError, showSuccess } from "@/lib/toast"
import InputField from "@/components/ui/InputField"
import FormWrapper from "@/components/ui/FormWrapper"
import PrimaryButton from "@/components/ui/PrimaryButton"
import LabelledField from "@/components/ui/LabelledField"
import PageWrapper from "@/components/ui/PageWrapper" 

/**
 * Componente LoginPage
 * 
 * Este componente implementa la funcionalidad de inicio de sesión en la aplicación.
 * Permite a los usuarios autenticarse mediante credenciales (correo electrónico y contraseña).
 */
export default function LoginPage() {
  /**
   * Estado local para almacenar las credenciales ingresadas por el usuario.
   */
  const [email, setEmail] = useState("") // Correo electrónico del usuario
  const [password, setPassword] = useState("") // Contraseña del usuario
  const router = useRouter() // Hook para manejar la navegación entre páginas

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * 
   * @param e - Evento de envío del formulario
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Evita el comportamiento predeterminado del formulario

    // Autenticación con NextAuth utilizando el proveedor de credenciales
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Evita la redirección automática
    })

    // Manejo de la respuesta de autenticación
    if (res?.ok) {
      showSuccess("Sesión iniciada correctamente") // Muestra un mensaje de éxito
      router.push("/") // Redirige al usuario a la página principal
    } else {
      showError("Credenciales inválidas") // Muestra un mensaje de error
    }
  }

  /**
   * Renderiza el formulario de inicio de sesión.
   * Utiliza componentes reutilizables para garantizar consistencia en el diseño.
   */
  return (
    <PageWrapper> {/* Contenedor general de la página */}
      <FormWrapper title="Iniciar sesión"> {/* Contenedor del formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo para ingresar el correo electrónico */}
          <LabelledField label="Correo electrónico:">
            <InputField
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo electrónico"
            />
          </LabelledField>

          {/* Campo para ingresar la contraseña */}
          <LabelledField label="Contraseña:">
            <InputField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </LabelledField>

          {/* Botón para enviar el formulario */}
          <PrimaryButton type="submit">Entrar</PrimaryButton>
        </form>
      </FormWrapper>
    </PageWrapper>
  )
}
