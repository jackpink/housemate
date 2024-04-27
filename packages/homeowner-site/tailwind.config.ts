import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx", "../ui/**/*.tsx"],
  presets: [require("../ui/tailwind-preset.ts")],
} satisfies Config;
