/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(100px) scale(0.8)" },
          "60%": { transform: "translateY(-20px) scale(1.05)" },
          "100%": { opacity: 1, transform: "translateY(0) scale(1)" },
        },
        flyingKick: {
          "0%": { transform: "translateY(200px) rotateX(90deg) scale(0.5)", opacity: 0, filter: "blur(15px)" },
          "60%": { transform: "translateY(-40px) rotateX(-15deg) scale(1.15)", filter: "blur(0)" },
          "80%": { transform: "translateY(10px) rotateX(5deg) scale(0.95)" },
          "100%": { transform: "translateY(0) rotateX(0) scale(1)", opacity: 1 },
        },
        punchIn: {
          "0%": { opacity: 0, transform: "scale(0.5) translateX(-100px) rotateY(40deg)" },
          "60%": { opacity: 1, transform: "scale(1.2) translateX(20px) rotateY(-15deg)" },
          "80%": { transform: "scale(0.95) translateX(-10px) rotateY(5deg)" },
          "100%": { opacity: 1, transform: "scale(1) translateX(0) rotateY(0)" },
        },
        sweepIn: {
          "0%": { opacity: 0, transform: "translateX(-100px) skewX(30deg)", filter: "blur(10px)" },
          "100%": { opacity: 1, transform: "translateX(0) skewX(0)", filter: "blur(0)" },
        },
        spinKick: {
          "0%": { opacity: 0, transform: "rotate(-45deg) scale(0.5)" },
          "60%": { transform: "rotate(15deg) scale(1.15)" },
          "80%": { transform: "rotate(-5deg) scale(0.95)" },
          "100%": { opacity: 1, transform: "rotate(0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 1.2s ease-out forwards",
        "flying-kick": "flyingKick 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "punch-in": "punchIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        "sweep-in": "sweepIn 1.1s ease-out forwards",
        "spin-kick": "spinKick 1.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
}
