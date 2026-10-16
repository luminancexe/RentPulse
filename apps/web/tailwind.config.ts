import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#FAF8F5",
        surface: "#FFFFFF",
        "muted-sand": "#F3EFEA",
        ink: {
          primary: "#1C1A17",
          secondary: "#736B64",
          tertiary: "#A39B92",
        },
        forest: {
          DEFAULT: "#2C4A3E",
          hover: "#233B31",
          light: "#EAF2EE",
        },
        terracotta: {
          DEFAULT: "#BD5338",
          hover: "#A5452E",
          light: "#FDF1EE",
        },
        hairline: {
          DEFAULT: "rgba(28, 26, 23, 0.08)",
          hover: "rgba(28, 26, 23, 0.16)",
          subtle: "rgba(28, 26, 23, 0.04)",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-plus-jakarta)", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 4px 20px rgba(28, 26, 23, 0.04)",
        hover: "0 8px 30px rgba(28, 26, 23, 0.08)",
        card: "0 1px 3px rgba(28, 26, 23, 0.02), 0 6px 24px rgba(28, 26, 23, 0.04)",
      },
      aspectRatio: {
        "16/10": "16 / 10",
        "3/2": "3 / 2",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
