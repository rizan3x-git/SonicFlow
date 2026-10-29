import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { ink: "#090b12", panel: "#111522", violet: "#8b5cf6", cyan: "#67e8f9" },
    boxShadow: { glow: "0 0 55px rgba(139,92,246,.18)" }
  }},
  plugins: []
};
export default config;