import tailwindcssAnimate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /^(bg-(?:green|red|blue|gray)-[56]00)$/,
      variants: ["hover"],
    },
    {
      pattern: /^(text-(?:green|red|blue|gray)-600)$/,
      variants: ["hover"],
    },
    {
      pattern: /^(ring-(?:green|red)-500)$/,
    },
  ],
  plugins: [tailwindcssAnimate],
};
