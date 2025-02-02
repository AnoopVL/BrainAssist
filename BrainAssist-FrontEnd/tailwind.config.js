/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          200: "#7c93ac",
          700: "#042c5c",
        },
        green: {
          600: "#35c3bd",
        },
      },
    },
  },
  plugins: [],
};
