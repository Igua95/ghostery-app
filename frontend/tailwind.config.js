module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        deep: "#0e0e10",
        surface: "#1a1a1d",
        accent: "#5eead4",
        secondary: "#a1a1aa",
        primary: "#f4f4f5",
        subtle: "#2d2d31",
        hover: "#27272a",
        error: "#f87171",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}