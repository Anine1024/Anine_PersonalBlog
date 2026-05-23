import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          card: 'var(--color-bg-card)',
          'card-hover': 'var(--color-bg-card-hover)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          hover: 'var(--color-border-hover)',
        },
        accent: {
          purple: 'var(--color-accent-purple)',
          'purple-light': 'var(--color-accent-purple-light)',
          'purple-glow': 'var(--color-accent-purple-glow)',
          cyan: 'var(--color-accent-cyan)',
          blue: 'var(--color-accent-blue)',
        },
        glass: {
          bg: 'var(--color-glass-bg)',
          border: 'var(--color-glass-border)',
        },
      },
      borderRadius: {
        card: '16px',
        'card-lg': '24px',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backdropBlur: {
        navbar: '12px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px var(--color-accent-purple-glow)' },
          '100%': { boxShadow: '0 0 20px var(--color-accent-purple-glow)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
