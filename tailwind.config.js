/** @type {import('tailwindcss').Config} */
export default {
  content: ['./resources/**/*.blade.php', './resources/js/**/*.jsx'],
  theme: {
    extend: {
      colors: {
        panel: '#141b2d',
        panel2: '#101625',
        base: '#0b0f1a',
        border: '#232c42',
        ink: '#e6e9f2',
        muted: '#8a93ab',
        accent: '#3b82f6',
        good: '#22c55e',
        bad: '#ef4444',
        warn: '#f2b90c',
        neutralgray: '#6b7385',
        // Tema terang untuk area konten (di luar header & sidebar, yang tetap gelap).
        surface: '#f3f5f9',
        card: '#ffffff',
        card2: '#f1f4f9',
        cborder: '#e3e7ee',
        cink: '#0f172a',
        csub: '#64748b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}