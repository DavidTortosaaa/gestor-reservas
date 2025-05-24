"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

type EstadoButtonProps = {
  reservaId: string;
};

export function OpcionesReservaButtons({ reservaId}: EstadoButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const cambiarEstado = (accion: "confirmar" | "cancelar") => {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("accion", accion);

      const res = await fetch(`/api/reservas/${reservaId}/estado`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        router.refresh(); // refrescar datos
      } else {
        const err = await res.json();
        setError(err.message || "Error");
      }
    });
  };

  return (
    <div className="mt-2 flex gap-2">
      <button
        disabled={isPending}
        onClick={() => cambiarEstado("confirmar")}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
      >
        Confirmar
      </button>
      <button
        disabled={isPending}
        onClick={() => cambiarEstado("cancelar")}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Cancelar
      </button>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}