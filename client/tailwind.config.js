/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          background: "var(--bg-primary)",
          surface: "var(--bg-secondary)",
          primary: "var(--text-primary)", 
          secondary: "var(--text-secondary)",
          border: "var(--border-color)",
          gold: "var(--silk-gold)",
        },
      },
    },
    plugins: [],
  }
