import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // JobNachbar Brand Colors - New Premium Palette
        brand: {
          // Primary
          red: '#E63946',
          'red-dark': '#C62E3A',
          'red-light': '#FF4D5A',
          // Backgrounds
          dark: '#1D1D1F',
          'dark-lighter': '#2D2D2F',
          'dark-card': '#252527',
          // Text & Accents
          white: '#F8F8F8',
          cream: '#F5F5F5',
          gray: '#8E8E93',
          'gray-light': '#AEAEB2',
          // Role Colors
          bewerber: '#F8F8F8',
          arbeitgeber: '#E63946',
          // Legacy support (gradual migration)
          navy: '#1D1D1F',
          slate: '#2D2D2F',
          blue: '#E63946',
          cyan: '#E63946',
          emerald: '#34d399',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
