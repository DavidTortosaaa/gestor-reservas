"use client";

import { useState } from "react";
import { showSuccess, showError } from "@/lib/toast";

type Props = {
  reservaId: string;
};

export default function CancelarReservaButton({ reservaId }: Props) {
  const [loading, setLoading] = useState(false);

  const cancelarReserva = async () => {
    const confirmar = confirm("¿Seguro que deseas cancelar esta reserva?");
    if (!confirmar) return;

    setLoading(true);

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

    setLoading(false);
  };

  return (
    <button
      onClick={cancelarReserva}
      disabled={loading}
      className="mt-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Cancelando..." : "Cancelar"}
    </button>
  );
}
