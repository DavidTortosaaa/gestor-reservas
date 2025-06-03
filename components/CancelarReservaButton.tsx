"use client";

import { showSuccess, showError } from "@/lib/toast"; // ✅ importar toast

type Props = {
  reservaId: string;
};

export default function CancelarReservaButton({ reservaId }: Props) {
  async function cancelarReserva() {
    const confirmacion = confirm("¿Seguro que deseas cancelar esta reserva?");
    if (!confirmacion) return;

    const res = await fetch(`/api/reservas/${reservaId}/estado`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nuevoEstado: "cancelada" }),
    });

    if (res.ok) {
      showSuccess("Reserva cancelada correctamente");
      window.location.reload();
    } else {
      showError("No se pudo cancelar la reserva");
    }
  }

  return (
    <button
      className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      onClick={cancelarReserva}
    >
      Cancelar
    </button>
  );
}
