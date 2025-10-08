/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Add your custom animation keyframes here
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "200% 50%, 150% 50%",
          },
        },
      },
      // 2. Create a utility class that uses your new keyframes
      animation: {
        aurora: "aurora 60s linear infinite",
      },
    },
  },
  plugins: [],
}