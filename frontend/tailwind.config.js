/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        panel: "hsl(var(--panel))",
        muted: "hsl(var(--muted))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        danger: "hsl(var(--danger))",
        accent: "hsl(var(--accent))"
      },
      boxShadow: {
        soft: "0 12px 30px -18px rgba(15, 23, 42, 0.45)",
        glow: "0 0 0 1px rgba(148, 163, 184, 0.1), 0 25px 55px -40px rgba(15, 23, 42, 0.6)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui"],
        body: ["Source Sans 3", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
