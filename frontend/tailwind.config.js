/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534', // Primary brand color: #166534
          900: '#14532d',
          950: '#052e16',
        },
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#22c55e', // Secondary brand color: #22C55E
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        limeAccent: {
          DEFAULT: '#BEF264', // Accent: Lime Green #BEF264
          hover: '#a3e635',
          light: '#f7fee7',
        },
        softWhite: '#F8FAF8', // Background: Soft White #F8FAF8
        charcoal: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1F2937', // Text: Dark Charcoal #1F2937
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'eco': '0 4px 20px -2px rgba(22, 101, 52, 0.08), 0 2px 6px -1px rgba(22, 101, 52, 0.04)',
        'eco-lg': '0 10px 25px -3px rgba(22, 101, 52, 0.12), 0 4px 10px -2px rgba(22, 101, 52, 0.06)',
        'glow': '0 0 15px rgba(34, 197, 94, 0.35)',
        'glow-accent': '0 0 20px rgba(190, 242, 100, 0.4)',
      }
    },
  },
  plugins: [],
}
