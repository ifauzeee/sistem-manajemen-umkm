/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    // Pastikan path ini benar, menunjuk ke SEMUA file di dalam src
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#D4AF37',
        'primary-hover': '#E0C56B',
        'secondary': '#10B981',
        'danger': '#EF4444',
        'danger-hover': '#DC2626',
        'background': '#000000',
        'surface': '#111111',
        'text-primary': '#E5E5E5',
        'text-secondary': '#888888',
        'border-color': '#2D2D2D',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}