import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui, // <--- Aquí activamos DaisyUI
  ],
  // Configuración opcional de DaisyUI
  daisyui: {
    themes: ["light", "dark", "corporate"], // 'corporate' es ideal para sistemas de gestión
  },
}