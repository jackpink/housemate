// import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      width: {
        "128": "50rem",
        "144": "56rem",
        "160": "64rem",
        "176": "72rem",
        "192": "80rem",
        "208": "88rem",
      },
      screens: {
        "3xl": "1800px",
      },
      colors: {
        primary: "#acf7c1",
        secondary: " #ccfff4",
        brand: "#7df2cd",
        brandSecondary: "#c470e7",
        dark: "#011627",
        light: "#f7ece1",
        altPrimary: "#004459", //#0E7C7B",0A5B5A
        altSecondary: "#86bbbd", //#
        todo: "#7FC8F8",
        completed: "#37D518", //#8ED081
        issue: "#dc2626",
        product: "#ff871a",
      },
      transitionProperty: {
        "max-height": "max-height",
        visibility: "visibility",
      },
    },
  },
  plugins: [],
};
