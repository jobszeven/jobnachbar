'use client'

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#252527',
          color: '#F8F8F8',
          border: '1px solid #374151',
          padding: '16px',
          borderRadius: '12px',
        },
        success: {
          iconTheme: {
            primary: '#34d399',
            secondary: '#252527',
          },
        },
        error: {
          iconTheme: {
            primary: '#E63946',
            secondary: '#252527',
          },
        },
      }}
    />
  )
}
