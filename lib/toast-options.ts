// lib/toast-options.ts
import type { ToasterProps } from "react-hot-toast";

export const toastOptions: ToasterProps = {
  position: "top-right",
  reverseOrder: false,
  toastOptions: {
    duration: 3000, // ⏱ Desaparece después de 3 segundos
    style: {
      backgroundColor: "#ffffff", // usa backgroundColor en lugar de background
      color: "#1f2937", // gray-800
      border: "1px solid #e5e7eb", // gray-200
      padding: "12px 16px",
      fontSize: "0.875rem", // text-sm
      borderRadius: "0.5rem", // rounded-md
      boxShadow: "0 4px 14px rgba(0, 0, 0, 0.05)", // shadow similar a card
    },
    success: {
      iconTheme: {
        primary: "#10b981", // green-500
        secondary: "#ecfdf5", // green-50
      },
    },
    error: {
      iconTheme: {
        primary: "#ef4444", // red-500
        secondary: "#fef2f2", // red-50
      },
    },
  },
};
