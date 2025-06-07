'use client';

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { showSuccess, showError } from "@/lib/toast";
import PrimaryButton from "@/components/ui/PrimaryButton";

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
      <PrimaryButton
        onClick={() => cambiarEstado("confirmar")}
        disabled={isPending}
        className="!w-auto bg-green-600 hover:bg-green-700"
      >
        Confirmar
      </PrimaryButton>
      <PrimaryButton
        onClick={() => cambiarEstado("cancelar")}
        disabled={isPending}
        className="!w-auto bg-red-600 hover:bg-red-700"
      >
        Cancelar
      </PrimaryButton>
    </div>
  );
}
