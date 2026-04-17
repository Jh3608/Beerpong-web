/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FCD34D',
        secondary: '#1F2937',
        background: '#0F172A',
        surface: '#1E293B',
        foreground: '#F1F5F9',
        muted: '#94A3B8',
        border: '#334155',
      },
    },
  },
  plugins: [],
}
