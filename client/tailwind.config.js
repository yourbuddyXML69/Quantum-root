/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        quantoom: {
          bg: '#080B10',
          card: '#0F141C',
          border: '#1E293B',
          blue: '#00E5FF',
          violet: '#8A2BE2',
          green: '#00FF66',
          yellow: '#FFD700',
          crimson: '#FF2E63',
        },
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(0, 229, 255, 0.35)',
        'glow-violet': '0 0 20px rgba(138, 43, 226, 0.35)',
        'glow-green': '0 0 20px rgba(0, 255, 102, 0.35)',
      }
    },
  },
  plugins: [],
}
