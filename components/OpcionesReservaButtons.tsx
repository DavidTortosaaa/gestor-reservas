"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { showSuccess, showError } from "@/lib/toast"; // Asegúrate que esto exista

type EstadoButtonProps = {
  reservaId: string;
};

export function OpcionesReservaButtons({ reservaId }: EstadoButtonProps) {
  const [isPending, startTransition] = useTransition();
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
        showSuccess(`Reserva ${accion === "confirmar" ? "confirmada" : "cancelada"} correctamente.`);
        router.refresh();
      } else {
        const err = await res.json();
        showError(err.message || "Error al cambiar el estado.");
      }
    });
  };

  return (
    <div className="mt-2 flex gap-2">
      <button
        disabled={isPending}
        onClick={() => cambiarEstado("confirmar")}
        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:opacity-50"
      >
        Confirmar
      </button>
      <button
        disabled={isPending}
        onClick={() => cambiarEstado("cancelar")}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>
  );
}
