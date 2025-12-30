import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl2: "20px",
        xl3: "24px",
      },
      colors: {
        primary: {
          100: "#FEFEFE",
          200: "#F6F6F6",
          300: "#EEEEEE",
          400: "#EFEFF2",
          500: "#D4D4D4",
          600: "#A8A8A8",
          700: "#707070",
          800: "#515151",
          900: "#262626",
        },
        status: {
          green: {
            100: "#DAFFEF",
            200: "#9DE9C9",
            300: "#6DDDAE",
            400: "#3CD293",
            500: "#0BC778",
            600: "#099F60",
          },
          orange: {
            100: "#FCECD3",
            200: "#F9D9A7",
            300: "#F5C57B",
            400: "#F2B24F",
            500: "#EF9F23",
          },
          red: {
            100: "#FFDDDD",
            200: "#FFBBBB",
            300: "#FF9A9A",
            400: "#FF7878",
            500: "#FF5656",
          },
        },
      },
      boxShadow: {
        "modal": "0 8px 30px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
