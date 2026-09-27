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
        background: '#070B14',
        panel: {
          DEFAULT: '#0E1626',
          translucent: 'rgba(14, 22, 38, 0.78)',
          card: 'rgba(17, 28, 48, 0.85)',
          hover: 'rgba(28, 43, 71, 0.85)',
        },
        accent: {
          orange: '#F28C28',
          navy: '#1F3864',
          blue: '#0070C0',
          cyan: '#00D2FF',
        },
        hazard: {
          lightning: '#FFD400',
          hail: '#E0E7FF',
          downburst: '#A855F7',
          cloudburst: '#1E88E5',
          severe: '#C0182D',
          moderate: '#F59E0B',
          low: '#10B981',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.08)',
        'glass-bright': 'rgba(255, 255, 255, 0.16)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        glow: '0 0 20px rgba(242, 140, 40, 0.25)',
        'glow-cyan': '0 0 20px rgba(0, 210, 255, 0.25)',
        'glow-red': '0 0 20px rgba(192, 24, 45, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash-fast': 'flash 1.2s infinite',
        'radar-sweep': 'sweep 4s linear infinite',
      },
      keyframes: {
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.2' },
        },
        sweep: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
