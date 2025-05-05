import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })} // Redirige a la página de inicio después de cerrar sesión
      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
    >
      Cerrar sesión
    </button>
  )
}