// lib/toast-options.ts
import type { ToasterProps } from 'react-hot-toast'

export const toastOptions: ToasterProps = {
  position: 'top-right',
  reverseOrder: false,
  toastOptions: {
    duration: 3000, // 👈 Desaparece después de 3 segundos
    style: {
      background: '#ffffff',
      color: '#1f2937',
      border: '1px solid #e5e7eb',
      padding: '12px 16px',
      fontSize: '0.875rem',
    },
    success: {
      iconTheme: {
        primary: '#10b981',
        secondary: '#ecfdf5',
      },
    },
    error: {
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fef2f2',
      },
    },
  },
}

