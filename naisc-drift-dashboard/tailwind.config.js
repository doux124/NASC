/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Singtel-inspired brand palette
        brand: {
          accent: '#e4006a',
          accent2: '#ff4b8b',
          orange: '#ff6b35',
          teal: '#00d4a8',
          purple: '#7c5cfc',
          amber: '#ffb547',
        },
        // Dashboard surface system
        surface: {
          0: '#07070f',
          1: '#0d0d1c',
          2: '#131326',
          3: '#1a1a33',
        },
        border: {
          subtle: '#1c1c35',
          strong: '#252545',
        },
        ink: {
          DEFAULT: '#e9e9f4',
          muted: '#8888aa',
          faint: '#5a5a80',
        },
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      letterSpacing: {
        widest2: '0.2em',
      },
      boxShadow: {
        'glow-accent': '0 0 24px -8px rgba(228, 0, 106, 0.55)',
        'glow-teal': '0 0 24px -8px rgba(0, 212, 168, 0.55)',
        'card': '0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 30px -12px rgba(0,0,0,0.6)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.85)' },
        },
        'scan': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) both',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        'scan': 'scan 2.4s linear infinite',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-24': '24px 24px',
      },
    },
  },
  plugins: [],
}
