/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {

      keyframes: {
        zoomIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        zoomOut: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8)', opacity: '0' },
        },
        
      },
      animation: {
        zoomIn: 'zoomIn 0.3s ease-out forwards',
        zoomOut: 'zoomOut 0.3s ease-in forwards',
      },
        screens: {
          xs: "320px",
          android: "360px",
          iphone:"375px",
          sm: "480px",
        },
        fontFamily: {
          montserrat: ['Montserrat', 'sans-serif'],
          'nunito-sans': ['Nunito Sans', 'sans-serif'],
          nunito: ['Nunito', 'sans-serif'],
          roboto: ['Roboto', 'sans-serif'],
          sans: ["sans-serif"],
          
        },
        colors: {
          "debo-green": "#0f5841",
          "debo-blue": "#194f87",
          "debo-dark-blue": "#021122",
          "debo-gray": "#EEEEEE",
          'debo-yellow': '#dd9529',
          'yellow-400': '#facc15'
        }
      },
    },
    plugins: [],
  }

